# Conceitos Kubernetes

## 📚 Sobre este arquivo
Este arquivo contém conceitos essenciais do **Kubernetes** - plataforma de orquestração de containers que automatiza deploy, escalonamento e gerenciamento de aplicações containerizadas:

### ☸️ Fundamentos Kubernetes
- `Pod` - Menor unidade de deploy, agrupa um ou mais containers
- `Deployment` - Gerencia réplicas de pods e atualizações
- `Service` - Expõe pods para comunicação interna/externa
- `Ingress` - Gerencia acesso HTTP/HTTPS externo

### 🏗️ Arquitetura Kubernetes
- Control Plane (Master) e Worker Nodes
- etcd, API Server, Scheduler, Controller Manager
- kubelet, kube-proxy, Container Runtime
- Cluster networking e DNS

### 📦 Workloads e Recursos
- `ReplicaSet` - Mantém número específico de pods
- `StatefulSet` - Pods com identidade persistente
- `DaemonSet` - Pod em cada node do cluster
- `Job/CronJob` - Tarefas batch e agendadas

### 🔧 Configuração e Secrets
- `ConfigMap` - Configurações não-sensíveis
- `Secret` - Dados sensíveis (senhas, tokens)
- `PersistentVolume` - Armazenamento persistente
- `Namespace` - Isolamento de recursos

### 🚀 Deploy de Next.js
- Configuração de manifests YAML
- Estratégias de deployment
- Configuração de ingress e SSL
- Monitoramento e observabilidade

> **Nota**: Para conceitos de Docker (containerização), consulte o arquivo `conceitos-docker.md`

---

## Kubernetes

### O que é Kubernetes?
Kubernetes (K8s) é uma plataforma open-source de orquestração de containers que automatiza o deploy, escalonamento e gerenciamento de aplicações containerizadas.

#### Por que usar Kubernetes?
- **Orquestração**: Gerencia múltiplos containers automaticamente
- **Auto-scaling**: Escala aplicações baseado na demanda
- **Self-healing**: Reinicia containers com falha automaticamente
- **Rolling updates**: Atualizações sem downtime
- **Service discovery**: Descoberta automática de serviços
- **Load balancing**: Distribui tráfego automaticamente

### Arquitetura do Kubernetes

#### Control Plane (Master)
```
┌─────────────────────────────────────┐
│            Control Plane            │
├─────────────────────────────────────┤
│  API Server  │  etcd  │  Scheduler  │
│ Controller   │        │             │
│  Manager     │        │             │
└─────────────────────────────────────┘
```

#### Worker Nodes
```
┌─────────────────────────────────────┐
│              Worker Node            │
├─────────────────────────────────────┤
│  kubelet  │  kube-proxy  │ Container│
│           │              │ Runtime  │
│           │              │ (Docker) │
└─────────────────────────────────────┘
```

### Conceitos Fundamentais

#### Pod
Menor unidade de deploy no Kubernetes. Agrupa um ou mais containers.

```yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nextjs-pod
  labels:
    app: nextjs
spec:
  containers:
  - name: nextjs-container
    image: nextjs-app:latest
    ports:
    - containerPort: 3000
    env:
    - name: NODE_ENV
      value: "production"
    resources:
      requests:
        memory: "256Mi"
        cpu: "250m"
      limits:
        memory: "512Mi"
        cpu: "500m"
```

#### Deployment
Gerencia réplicas de pods e controla atualizações.

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nextjs-deployment
  labels:
    app: nextjs
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nextjs
  template:
    metadata:
      labels:
        app: nextjs
    spec:
      containers:
      - name: nextjs
        image: nextjs-app:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: NODE_ENV
          value: "production"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

#### Service
Expõe pods para comunicação.

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nextjs-service
spec:
  selector:
    app: nextjs
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
---
# LoadBalancer service para acesso externo
apiVersion: v1
kind: Service
metadata:
  name: nextjs-loadbalancer
spec:
  selector:
    app: nextjs
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

### ConfigMap e Secrets

#### ConfigMap
Armazena configurações não-sensíveis.

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nextjs-config
data:
  NODE_ENV: "production"
  API_URL: "https://api.exemplo.com"
  NEXT_PUBLIC_SITE_URL: "https://meusite.com"
  # Arquivo de configuração completo
  app.properties: |
    debug=false
    api.timeout=30
    cache.ttl=3600
```

#### Secret
Armazena dados sensíveis.

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: nextjs-secret
type: Opaque
data:
  # Valores em base64
  DATABASE_URL: cG9zdGdyZXNxbDovL3VzZXI6cGFzc3dvcmRAZGI6NTQzMi9teWFwcA==
  NEXTAUTH_SECRET: bXktc2VjcmV0LWtleQ==
  JWT_SECRET: and0LXNlY3JldA==
---
# Secret a partir de arquivo
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTi... # certificado em base64
  tls.key: LS0tLS1CRUdJTi... # chave privada em base64
```

#### Usando ConfigMap e Secret no Pod
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nextjs-deployment
spec:
  template:
    spec:
      containers:
      - name: nextjs
        image: nextjs-app:latest
        envFrom:
        - configMapRef:
            name: nextjs-config
        - secretRef:
            name: nextjs-secret
        env:
        # Variável específica do ConfigMap
        - name: API_TIMEOUT
          valueFrom:
            configMapKeyRef:
              name: nextjs-config
              key: api.timeout
        # Variável específica do Secret
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: nextjs-secret
              key: DATABASE_PASSWORD
        volumeMounts:
        - name: config-volume
          mountPath: /app/config
        - name: secret-volume
          mountPath: /app/secrets
      volumes:
      - name: config-volume
        configMap:
          name: nextjs-config
      - name: secret-volume
        secret:
          secretName: nextjs-secret
```

### Persistent Volumes

#### PersistentVolume
```yaml
# persistent-volume.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: postgres-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: fast-ssd
  hostPath:
    path: /data/postgres
```

#### PersistentVolumeClaim
```yaml
# persistent-volume-claim.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: fast-ssd
```

#### Usando PVC no Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: myapp
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc
```

### Ingress
Gerencia acesso HTTP/HTTPS externo ao cluster.

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nextjs-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - meusite.com
    - www.meusite.com
    secretName: nextjs-tls
  rules:
  - host: meusite.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nextjs-service
            port:
              number: 80
  - host: www.meusite.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nextjs-service
            port:
              number: 80
```

### Namespace
Isolamento de recursos no cluster.

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    env: production
---
apiVersion: v1
kind: Namespace
metadata:
  name: development
  labels:
    env: development
```

### StatefulSet
Para aplicações que necessitam de identidade persistente.

```yaml
# statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres-statefulset
spec:
  serviceName: postgres-service
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
```

### DaemonSet
Executa um pod em cada node do cluster.

```yaml
# daemonset.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-collector
spec:
  selector:
    matchLabels:
      app: log-collector
  template:
    metadata:
      labels:
        app: log-collector
    spec:
      containers:
      - name: fluentd
        image: fluentd:latest
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
```

### Job e CronJob

#### Job (tarefa única)
```yaml
# job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: database-migration
spec:
  template:
    spec:
      containers:
      - name: migration
        image: nextjs-app:latest
        command: ["npm", "run", "migrate"]
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
      restartPolicy: Never
  backoffLimit: 4
```

#### CronJob (tarefa agendada)
```yaml
# cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: backup-database
spec:
  schedule: "0 2 * * *"  # Todo dia às 2h da manhã
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15-alpine
            command:
            - /bin/bash
            - -c
            - pg_dump $DATABASE_URL > /backup/backup_$(date +%Y%m%d_%H%M%S).sql
            env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc
          restartPolicy: OnFailure
```

### HorizontalPodAutoscaler (HPA)
Auto-scaling baseado em métricas.

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nextjs-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nextjs-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15
```

### Deploy Completo Next.js no Kubernetes

#### Estrutura de arquivos
```
k8s/
├── namespace.yaml
├── configmap.yaml
├── secret.yaml
├── deployment.yaml
├── service.yaml
├── ingress.yaml
├── hpa.yaml
└── postgres/
    ├── deployment.yaml
    ├── service.yaml
    ├── pvc.yaml
    └── secret.yaml
```

#### Deployment completo
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nextjs-app
  namespace: production
  labels:
    app: nextjs
    version: v1.0.0
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: nextjs
  template:
    metadata:
      labels:
        app: nextjs
        version: v1.0.0
    spec:
      containers:
      - name: nextjs
        image: nextjs-app:v1.0.0
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: nextjs-secret
              key: database-url
        - name: NEXTAUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: nextjs-secret
              key: nextauth-secret
        - name: NEXTAUTH_URL
          valueFrom:
            configMapKeyRef:
              name: nextjs-config
              key: nextauth-url
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /api/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        securityContext:
          runAsNonRoot: true
          runAsUser: 1001
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: nextjs-cache
          mountPath: /.next
      volumes:
      - name: tmp
        emptyDir: {}
      - name: nextjs-cache
        emptyDir: {}
      securityContext:
        fsGroup: 1001
```

#### Service com LoadBalancer
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nextjs-service
  namespace: production
  labels:
    app: nextjs
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
    name: http
  selector:
    app: nextjs
---
apiVersion: v1
kind: Service
metadata:
  name: nextjs-lb
  namespace: production
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
  selector:
    app: nextjs
```

### Comandos kubectl Essenciais

#### Gestão de recursos
```bash
# Aplicar manifests
kubectl apply -f deployment.yaml
kubectl apply -f k8s/  # Aplica todos os arquivos da pasta

# Criar recursos
kubectl create deployment nextjs --image=nextjs-app:latest
kubectl create service clusterip nextjs --tcp=80:3000

# Deletar recursos
kubectl delete deployment nextjs
kubectl delete -f deployment.yaml

# Listar recursos
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get ingress
kubectl get nodes

# Detalhes de um recurso
kubectl describe pod nextjs-pod
kubectl describe deployment nextjs-deployment

# Logs
kubectl logs nextjs-pod
kubectl logs -f nextjs-pod  # Follow logs
kubectl logs deployment/nextjs-deployment
```

#### Debugging
```bash
# Entrar no pod
kubectl exec -it nextjs-pod -- /bin/sh

# Port forward para teste local
kubectl port-forward pod/nextjs-pod 3000:3000
kubectl port-forward service/nextjs-service 3000:80

# Copiar arquivos
kubectl cp nextjs-pod:/app/logs ./logs
kubectl cp ./config.json nextjs-pod:/app/config.json

# Ver eventos
kubectl get events
kubectl get events --sort-by=.metadata.creationTimestamp

# Status do cluster
kubectl cluster-info
kubectl top nodes
kubectl top pods
```

#### Scaling
```bash
# Escalar deployment
kubectl scale deployment nextjs-deployment --replicas=5

# Auto-scaling
kubectl autoscale deployment nextjs-deployment --cpu-percent=70 --min=2 --max=10

# Rolling update
kubectl set image deployment/nextjs-deployment nextjs=nextjs-app:v2.0.0

# Rollback
kubectl rollout undo deployment/nextjs-deployment
kubectl rollout history deployment/nextjs-deployment
kubectl rollout status deployment/nextjs-deployment
```

### Kustomize
Ferramenta para customizar manifests Kubernetes.

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

# Namespace comum
namespace: production

# Prefixo para todos os recursos
namePrefix: nextjs-

# Labels comuns
commonLabels:
  app: nextjs
  env: production

# Recursos base
resources:
- deployment.yaml
- service.yaml
- configmap.yaml
- secret.yaml
- ingress.yaml

# Patches para customização
patchesStrategicMerge:
- production-patches.yaml

# ConfigMap generators
configMapGenerator:
- name: nextjs-config
  literals:
  - NODE_ENV=production
  - API_URL=https://api.exemplo.com

# Secret generators
secretGenerator:
- name: nextjs-secret
  literals:
  - DATABASE_URL=postgresql://user:pass@db:5432/app
```

```yaml
# production-patches.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nextjs-deployment
spec:
  replicas: 5
  template:
    spec:
      containers:
      - name: nextjs
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

```bash
# Aplicar com kustomize
kubectl apply -k .
```

### Helm Charts
Gerenciador de pacotes para Kubernetes.

```yaml
# Chart.yaml
apiVersion: v2
name: nextjs-app
description: Next.js application Helm chart
version: 0.1.0
appVersion: "1.0.0"
```

```yaml
# values.yaml
replicaCount: 3

image:
  repository: nextjs-app
  tag: "latest"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
  targetPort: 3000

ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: meusite.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: nextjs-tls
      hosts:
        - meusite.com

resources:
  requests:
    memory: 256Mi
    cpu: 250m
  limits:
    memory: 512Mi
    cpu: 500m

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

env:
  NODE_ENV: production
  
secrets:
  DATABASE_URL: ""
  NEXTAUTH_SECRET: ""
```

```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "nextjs-app.fullname" . }}
  labels:
    {{- include "nextjs-app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "nextjs-app.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "nextjs-app.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.service.targetPort }}
              protocol: TCP
          env:
            {{- range $key, $value := .Values.env }}
            - name: {{ $key }}
              value: {{ $value | quote }}
            {{- end }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
```

```bash
# Comandos Helm
helm create nextjs-app
helm install nextjs-app ./nextjs-app
helm upgrade nextjs-app ./nextjs-app
helm uninstall nextjs-app
helm list
```

### Monitoramento com Prometheus e Grafana

```yaml
# prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
```

```javascript
// Instrumentação no Next.js
// pages/api/metrics.js
import prometheus from 'prom-client';

// Criar métricas customizadas
const httpRequestsTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route']
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics());
  } else {
    res.status(405).end();
  }
}
```

### Logging e Observabilidade

```yaml
# fluentd-daemonset.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
spec:
  selector:
    matchLabels:
      name: fluentd
  template:
    metadata:
      labels:
        name: fluentd
    spec:
      containers:
      - name: fluentd
        image: fluent/fluentd-kubernetes-daemonset:v1-debian-elasticsearch
        env:
        - name: FLUENT_ELASTICSEARCH_HOST
          value: "elasticsearch.logging.svc.cluster.local"
        - name: FLUENT_ELASTICSEARCH_PORT
          value: "9200"
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
```

### CI/CD com GitHub Actions e Kubernetes

```yaml
# .github/workflows/deploy-k8s.yml
name: Deploy to Kubernetes

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'latest'
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-west-2
    
    - name: Update kubeconfig
      run: aws eks update-kubeconfig --name my-cluster
    
    - name: Build and push Docker image
      run: |
        docker build -t nextjs-app:${{ github.sha }} .
        docker tag nextjs-app:${{ github.sha }} my-registry/nextjs-app:${{ github.sha }}
        docker push my-registry/nextjs-app:${{ github.sha }}
    
    - name: Deploy to Kubernetes
      run: |
        sed -i 's|nextjs-app:latest|my-registry/nextjs-app:${{ github.sha }}|' k8s/deployment.yaml
        kubectl apply -f k8s/
        kubectl rollout status deployment/nextjs-deployment
    
    - name: Verify deployment
      run: |
        kubectl get pods -l app=nextjs
        kubectl get services
```

---

## 🎯 Resumo dos Conceitos Kubernetes

Este arquivo contém os principais conceitos do **Kubernetes** que todo desenvolvedor deve dominar:

### Fundamentos Essenciais
- **Pods**: Menor unidade de deploy, agrupa containers
- **Deployments**: Gerenciamento de réplicas e atualizações
- **Services**: Exposição e descoberta de serviços
- **Ingress**: Gerenciamento de tráfego HTTP/HTTPS externo

### Configuração e Dados
- **ConfigMaps**: Configurações não-sensíveis
- **Secrets**: Dados sensíveis (senhas, chaves)
- **PersistentVolumes**: Armazenamento persistente
- **Namespaces**: Isolamento de recursos

### Workloads Especializados
- **StatefulSets**: Aplicações com estado persistente
- **DaemonSets**: Pods em todos os nodes
- **Jobs/CronJobs**: Tarefas batch e agendadas
- **HPA**: Auto-scaling baseado em métricas

### Deploy e DevOps
- **Rolling Updates**: Atualizações sem downtime
- **Kustomize**: Customização de manifests
- **Helm**: Gerenciamento de pacotes
- **Monitoring**: Observabilidade com Prometheus/Grafana
