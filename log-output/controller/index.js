import { KubeConfig, AppsV1Api, CoreV1Api, Watch } from '@kubernetes/client-node';
import fetch from 'node-fetch';

const kc = new KubeConfig();
// try in-cluster first, fallback to kubeconfig
try {
  kc.loadFromCluster();
  console.log('Loaded in-cluster config');
} catch (e) {
  kc.loadFromDefault();
  console.log('Loaded local kubeconfig');
}

const coreApi = kc.makeApiClient(CoreV1Api);
const appsApi = kc.makeApiClient(AppsV1Api);
const watch = new Watch(kc);

const GROUP = 'example.com';
const VERSION = 'v1';
const PLURAL = 'dummysites';

// helper: create or replace ConfigMap
async function ensureConfigMap(namespace, name, html) {
  const cmName = `dummysite-${name}-cm`;
  const body = {
    metadata: { name: cmName },
    data: { 'index.html': html }
  };
  try {
    await coreApi.readNamespacedConfigMap(cmName, namespace);
    await coreApi.replaceNamespacedConfigMap(cmName, namespace, body);
    console.log('Updated ConfigMap', cmName);
  } catch (err) {
    await coreApi.createNamespacedConfigMap(namespace, body);
    console.log('Created ConfigMap', cmName);
  }
  return cmName;
}

// helper: create or replace Deployment that mounts the ConfigMap at nginx html dir
async function ensureDeployment(namespace, name, cmName) {
  const depName = `dummysite-${name}-dep`;
  const manifest = {
    metadata: { name: depName },
    spec: {
      replicas: 1,
      selector: { matchLabels: { app: depName } },
      template: {
        metadata: { labels: { app: depName } },
        spec: {
          containers: [{
            name: 'nginx',
            image: 'nginx:stable-alpine',
            ports: [{ containerPort: 80 }],
            volumeMounts: [{ name: 'site', mountPath: '/usr/share/nginx/html', readOnly: true }]
          }],
          volumes: [{ name: 'site', configMap: { name: cmName } }]
        }
      }
    }
  };
  try {
    await appsApi.readNamespacedDeployment(depName, namespace);
    await appsApi.replaceNamespacedDeployment(depName, namespace, manifest);
    console.log('Updated Deployment', depName);
  } catch (err) {
    await appsApi.createNamespacedDeployment(namespace, manifest);
    console.log('Created Deployment', depName);
  }
  return depName;
}

// helper: create or replace Service
async function ensureService(namespace, name, depName) {
  const svcName = `dummysite-${name}-svc`;
  const body = {
    metadata: { name: svcName },
    spec: { selector: { app: depName }, ports: [{ port: 80, targetPort: 80 }] }
  };
  try {
    await coreApi.readNamespacedService(svcName, namespace);
    await coreApi.replaceNamespacedService(svcName, namespace, body);
    console.log('Updated Service', svcName);
  } catch (err) {
    await coreApi.createNamespacedService(namespace, body);
    console.log('Created Service', svcName);
  }
  return svcName;
}

async function handleAdded(obj) {
  const ns = obj.metadata.namespace || 'default';
  const name = obj.metadata.name;
  const url = obj.spec && obj.spec.website_url;
  console.log('Handling DummySite added:', ns, name, url);
  try {
    if (!url) {
      console.error('No website_url in spec, skipping');
      return;
    }
    const resp = await fetch(url);
    const html = await resp.text();
    const cmName = await ensureConfigMap(ns, name, html);
    const depName = await ensureDeployment(ns, name, cmName);
    await ensureService(ns, name, depName);
    console.log('Resources created for', name);
  } catch (err) {
    console.error('Error handling DummySite', err);
  }
}

async function startWatch() {
  // NOTE: currently watching only 'default' namespace. To watch all namespaces, change path accordingly.
  const path = `/apis/${GROUP}/${VERSION}/namespaces/default/${PLURAL}`;
  watch.watch(
    path,
    {},
    (type, obj) => {
      if (type === 'ADDED') {
        handleAdded(obj);
      } else {
        // for brevity we only react to ADDED - production controller should handle UPDATE/DELETE and ownerRefs
        console.log('Event type:', type, 'for', obj.metadata.name);
      }
    },
    (err) => {
      console.error('Watch ended', err);
      setTimeout(startWatch, 5000);
    }
  ).then(req => {
    console.log('Started watch on', path);
  }).catch(err => {
    console.error('Failed to start watch', err);
  });
}

startWatch();
