# Analysis: "DevOps kurs o'tilgan darslar ro'yxati" (73-Lesson DevOps Course)

**Source:** Mirafzal Shavkatov, ["DevOps kurs o'tilgan darslar ro'yxati"](https://telegra.ph/DevOps-kurs-otilgan-darslar-royxati-10-10) (Telegra.ph, accessed 2026-07-18). 73 lessons across 8 phases: Foundations (1–10), Docker (11–14), CI/CD (15–26), Infrastructure as Code (27–32), Observability (33–37), Kubernetes (38–52), Secrets/Security/Scaling (53–58), Private Infrastructure (59–73).

## Table of Contents

1. [Phase 1 — Foundations (Lessons 1–10)](#phase-1--foundations-lessons-110)
2. [Phase 2 — Docker (Lessons 11–14)](#phase-2--docker-lessons-1114)
3. [Phase 3 — CI/CD (Lessons 15–26)](#phase-3--cicd-lessons-1526)
4. [Phase 4 — Infrastructure as Code (Lessons 27–32)](#phase-4--infrastructure-as-code-lessons-2732)
5. [Phase 5 — Observability (Lessons 33–37)](#phase-5--observability-lessons-3337)
6. [Phase 6 — Kubernetes (Lessons 38–52)](#phase-6--kubernetes-lessons-3852)
7. [Phase 7 — Secrets, Security, Scaling (Lessons 53–58)](#phase-7--secrets-security-scaling-lessons-5358)
8. [Phase 8 — Private Infrastructure (Lessons 59–73)](#phase-8--private-infrastructure-lessons-5973)
9. [Coverage & Progression Analysis](#coverage--progression-analysis)
10. [Complementarity with the Deep Mastery Plan](#complementarity-with-the-deep-mastery-plan)
11. [Full Lesson-Coverage Table](#full-lesson-coverage-table)
12. [Sources](#sources)

---

## Phase 1 — Foundations (Lessons 1–10)

Lessons 1–10 build the sysadmin/networking substrate everything later depends on: Linux CLI and internals, Git/GitHub, the OSI stack down to CIDR/NAT/firewalling, then a first taste of production deployment (WireGuard VPN, Nginx, Certbot, WSGI, PHP-FPM). This is classic "you can't orchestrate what you can't run by hand" sequencing — no container or CI abstraction is introduced until the trainee has manually deployed Django (WSGI) and Laravel (PHP-FPM) behind Nginx with real TLS certs.

| Tool/Concept | What it is & its role | Official documentation |
|---|---|---|
| **Linux (kernel)** | The open-source, Unix-like OS kernel (Linus Torvalds, 1991) underlying every distro used in the course; no single vendor "official doc" exists the way it does for a product, but kernel.org hosts the canonical kernel documentation tree. Covers commands, users, package managers, filesystems (lessons 2–4). | [kernel.org/doc](https://www.kernel.org/doc/html/latest/) |
| **Git** | Free, open-source distributed version-control system for tracking source changes locally, with fast branching/merging for non-linear workflows — the local counterpart to GitHub in lesson 5. | [git-scm.com/doc](https://git-scm.com/doc) |
| **GitHub** | Web-based Git hosting platform adding collaboration on top: pull requests, issues, and (later, phase 3) Actions-based CI/CD. | [docs.github.com](https://docs.github.com/) |
| **IPv4** | RFC 791 (1981), the original Internet Protocol specification: 32-bit addressing, header format, fragmentation, TTL — still the base standard, amended by later RFCs but not obsoleted. | [RFC 791](https://www.rfc-editor.org/rfc/rfc791) |
| **IPv6** | RFC 8200 (2017, Internet Standard STD 86) is the current IPv6 spec — 128-bit addressing and the modern header/extension-header format — and explicitly obsoletes RFC 2460. | [RFC 8200](https://www.rfc-editor.org/rfc/rfc8200) |
| **CIDR** | RFC 4632, "Classless Inter-Domain Routing," is the canonical spec and explicitly obsoletes RFC 1519 (1993). Replaces classful A/B/C addressing with variable-length prefixes (e.g. `/24`) for route aggregation — the basis of the course's subnetting lesson. | [RFC 4632](https://www.rfc-editor.org/rfc/rfc4632) |
| **NAT (incl. SNAT)** | RFC 3022, "Traditional IP Network Address Translator," defines Basic NAT and NAPT (port translation) and obsoletes RFC 1631 — the mechanism behind lesson 7's SNAT topic. | [RFC 3022](https://www.rfc-editor.org/rfc/rfc3022) |
| **iptables / nftables (Netfilter)** | Netfilter is the Linux kernel's packet-filtering framework; iptables is its long-standing rule-based firewall frontend, and nftables is the netfilter.org project's designated successor (unified syntax, better performance) — the "Firewall" topic in lesson 7. | [netfilter.org](https://www.netfilter.org/) / [wiki.nftables.org](https://wiki.nftables.org/) |
| **WireGuard** | Modern VPN protocol and implementation built on state-of-the-art cryptography, positioned by its author as simpler and faster than IPsec/OpenVPN. Course uses it as the VPN layer in lesson 8. | [wireguard.com](https://www.wireguard.com/) ([whitepaper](https://www.wireguard.com/papers/wireguard.pdf)) |
| **Nginx** | High-performance web server, reverse proxy, and load balancer (also mail proxy, FastCGI/uWSGI/gRPC upstreams) — the reverse-proxy layer for every deployment in lessons 8–10 onward. | [nginx.org/en/docs](https://nginx.org/en/docs/) |
| **Certbot** | EFF-maintained client that automates Let's Encrypt TLS certificate issuance/renewal, paired with Nginx for HTTPS in lesson 9. | [eff-certbot.readthedocs.io](https://eff-certbot.readthedocs.io/) |
| **Django (WSGI deployment)** | Django's own docs describe WSGI as the standard Python interface between web servers and Django apps; `startproject` generates a `wsgi.py` exposing an `application` callable, deployed via Gunicorn/uWSGI/mod_wsgi (lesson 10). | [docs.djangoproject.com — WSGI deployment](https://docs.djangoproject.com/en/stable/howto/deployment/wsgi/) |
| **PHP-FPM** | Per the official PHP manual, FPM (FastCGI Process Manager) is PHP's primary FastCGI implementation with advanced process/pool management, run behind Nginx to serve Laravel (lesson 10). | [php.net — Install FPM](https://www.php.net/manual/en/install.fpm.php) |
| **Laravel** | PHP web application framework with expressive routing, an ORM (Eloquent), and templating (Blade); has its own dedicated, versioned deployment guide. | [laravel.com/docs](https://laravel.com/docs) |

---

## Phase 2 — Docker (Lessons 11–14)

Four lessons take a trainee from "what is a container" to a load-balanced, zero-downtime Swarm cluster with optimized image builds — compressed but complete: images/volumes → Compose/networking → Swarm/registry/layers → Swarm networking/rolling updates/multi-stage/scratch.

| Tool/Concept | What it is & its role | Official documentation |
|---|---|---|
| **Docker (Engine)** | Platform for packaging applications with their dependencies into isolated containers, separate from the underlying infrastructure. Images are read-only templates; containers are runnable instances of images. | [docs.docker.com/guides/docker-overview](https://docs.docker.com/guides/docker-overview/) |
| **Docker volumes** | Persistent data stores created/managed by Docker and mounted into containers so data outlives a container's lifecycle — Docker's own docs call this "the preferred mechanism" for persisting container data (vs. the writable container layer). | [docs.docker.com/storage/volumes](https://docs.docker.com/storage/volumes/) |
| **Dockerfile** | "A text document that contains all the commands a user could call on the command line to assemble an image" — Docker builds the image automatically, one layer per instruction. | [docs.docker.com/reference/dockerfile](https://docs.docker.com/reference/dockerfile/) |
| **Docker Compose** | Tool for defining and running multi-container applications from a single YAML file, starting/stopping/managing the whole stack with one command. | [docs.docker.com/compose](https://docs.docker.com/compose/) |
| **Docker networking** | Containers reach each other and the outside world via pluggable network drivers. Bridge is the default single-host driver (user-defined bridges add name-based discovery); overlay connects multiple Docker daemons and is specifically for Swarm. | [docs.docker.com/engine/network](https://docs.docker.com/engine/network/) |
| **Docker Swarm** | Native clustering/orchestration mode built into Docker Engine. **Current status, verified directly against docs.docker.com**: functional but not the focus of new feature development — Docker's own docs state development "has slowed in favor of Kubernetes-based solutions," while remaining fully supported and functional. This is distinct from the long-discontinued "Classic Swarm." | [docs.docker.com/engine/swarm](https://docs.docker.com/engine/swarm/) |
| **Container registry (Distribution)** | Open-source server for storing/distributing container images. Docker donated it to the CNCF in 2019; it's developed today as "Distribution," and `docs.docker.com/registry` now points to this project. | [github.com/distribution/distribution](https://github.com/distribution/distribution) |
| **Image layers & build cache** | Every Dockerfile instruction adds a stacked, read-only layer; the build cache reuses unchanged layers, but changing one layer invalidates it and every layer after it — so instruction ordering (lesson 13's "Docker cache" topic) directly controls rebuild speed. | [docs.docker.com/build/cache](https://docs.docker.com/build/cache/) |
| **Rolling update (`docker service update`)** | Swarm updates service tasks sequentially — stop, schedule, start, wait `--update-delay`, repeat per `--update-parallelism` — keeping other replicas live throughout, which is how lesson 14 achieves zero-downtime updates. | [docs.docker.com — Swarm rolling update tutorial](https://docs.docker.com/engine/swarm/swarm-tutorial/rolling-update/) |
| **Multi-stage builds** | Dockerfile pattern with multiple `FROM` statements, each starting a fresh build stage; artifacts are selectively `COPY --from=` between stages so build tools and intermediates never reach the final image. | [docs.docker.com/build/building/multi-stage](https://docs.docker.com/build/building/multi-stage/) |
| **`scratch` base image** | "An explicitly empty image" per Docker Hub's own description — cannot be pulled or run itself, used only as the zero-byte base layer for minimal images containing just a static binary and its dependencies. | [hub.docker.com/_/scratch](https://hub.docker.com/_/scratch) |

*Note: Mirantis (Docker Swarm's commercial steward) has separately pledged support through 2030, but that claim comes from Mirantis, not docs.docker.com — kept out of the table above to preserve the "own official docs" citation rule.*

---

## Phase 3 — CI/CD (Lessons 15–26)

The longest phase (12 lessons) and the course's real center of gravity for "CI/CD" as a discipline: it deliberately cycles through the same problem (ship an app safely) across five different app stacks (Django, Django+Celery, Spring/Java, Go/Gin, Node websocket) and four different CI engines (GitHub Actions, GitLab CE, Jenkins, TeamCity), while also detouring into HA-application concepts (Raft, Patroni/etcd/HAProyx) that don't strictly belong to "CI/CD" but are introduced here because lesson 18–19 use a highly-available deploy target as the motivating example.

| Tool/Concept | What it is & its role | Official documentation |
|---|---|---|
| **PostgreSQL** | Open-source, ACID-compliant object-relational database extending SQL with advanced types (JSON/JSONB) and WAL-based point-in-time recovery; the datastore behind almost every app deployed in this phase. | [postgresql.org/about](https://www.postgresql.org/about/) |
| **Patroni** | Python-based template/agent for building HA PostgreSQL clusters: manages automatic failover and replication topology via a pluggable Distributed Configuration Store (etcd, Consul, ZooKeeper, or Kubernetes) for leader election. | [patroni.readthedocs.io](https://patroni.readthedocs.io/) |
| **etcd** | Distributed, strongly consistent key-value store used for configuration, coordination, and service discovery. Confirmed directly in etcd's own README: "etcd is written in Go and uses the Raft consensus algorithm to manage a highly-available replicated log" — i.e., etcd's HA and Patroni's leader-election both rest on Raft. | [etcd.io/docs](https://etcd.io/docs/) ([README confirming Raft](https://github.com/etcd-io/etcd/blob/main/README.md)) |
| **Raft (consensus algorithm)** | Consensus algorithm for replicated state machines, designed (per its own site) to be "equivalent to Paxos in fault-tolerance and performance" but easier to understand; created by Diego Ongaro and John Ousterhout, Best Paper at USENIX ATC 2014. This is lesson 18's "Raft protocol" topic and the mechanism underneath etcd. | [raft.github.io](https://raft.github.io/) |
| **HAProxy** | Free, open-source load balancer/reverse proxy for TCP and HTTP(S) traffic, with HTTP/2 and HTTP/3(QUIC) support — the traffic-routing layer in front of the Patroni cluster (lesson 19) and every "production deployment" lesson after it. | [haproxy.org](https://www.haproxy.org/) |
| **Celery** | Distributed task queue for Python focused on real-time asynchronous processing plus scheduling — used with Django in lesson 20 to move work off the request/response cycle. | [docs.celeryq.dev](https://docs.celeryq.dev/en/stable/) |
| **Redis (as Celery broker)** | In-memory key-value store also usable as a message broker; Celery's own docs confirm Redis as a supported broker (`broker_url = 'redis://...'`), which is the pairing lesson 20 teaches. | [redis.io/about](https://redis.io/about/) ([Celery's Redis broker docs](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/redis.html)) |
| **Spring / Spring Boot** | Spring Boot is an opinionated, auto-configured layer on top of the Spring Framework for building stand-alone, production-grade Java apps runnable via `java -jar` with an embedded server — the framework behind lesson 21's two-microservice Java example. | [docs.spring.io/spring-boot](https://docs.spring.io/spring-boot/index.html) |
| **GitHub Actions — reusable workflows** | Workflows callable from other workflows (must declare `on: workflow_call`), supporting typed inputs/secrets/outputs and up to 10 levels of nesting, referenceable across repos — lesson 22's mechanism for de-duplicating pipeline logic. | [docs.github.com — Reusing workflows](https://docs.github.com/en/actions/sharing-automations/reusing-workflows) |
| **GitHub Actions — self-hosted runners** | A runner you deploy and manage yourself (physical/VM/container) to execute Actions jobs, giving more control over hardware/OS/network than GitHub-hosted runners, at the cost of owning the infrastructure — lesson 23's topic. | [docs.github.com — About self-hosted runners](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners) |
| **Gin (Go)** | High-performance Go HTTP web framework built on an httprouter-based, zero-allocation radix-tree router, with built-in JSON/XML/HTML rendering and middleware chaining — the framework in lesson 22's Go CI/CD example. | [gin-gonic.com/docs](https://gin-gonic.com/en/docs/introduction/) |
| **GitLab CE (self-managed Free tier)** | GitLab's self-hosted Community Edition. Container Registry (per-project Docker V2/OCI image storage), tagged runners (a job only runs on a runner holding *all* its required tags), webhooks (HTTP callbacks on GitLab events), and toggle-only feature flags are all confirmed on the Free/self-managed tier per docs.gitlab.com's own tier badges — matching lessons 23–24's scope. | [Container Registry](https://docs.gitlab.com/user/packages/container_registry/) · [Runner tags](https://docs.gitlab.com/ci/runners/configure_runners/) · [Webhooks](https://docs.gitlab.com/user/project/integrations/webhooks/) · [Feature flags](https://docs.gitlab.com/operations/feature_flags/) |
| **Jenkins** | Self-described "leading open source automation server": a self-contained Java application with hundreds of plugins, a web UI, and distributed builds across multiple agent machines — lesson 25. | [jenkins.io](https://www.jenkins.io/) |
| **TeamCity** | JetBrains' CI/CD server: detects VCS changes, queues a build, assigns it to a build agent, and streams logs/test/coverage results live, with parallel builds across platforms — lesson 26. | [jetbrains.com/teamcity](https://www.jetbrains.com/teamcity/) ([docs](https://www.jetbrains.com/help/teamcity/continuous-integration-with-teamcity.html)) |

---

## Phase 4 — Infrastructure as Code (Lessons 27–32)

Six lessons cover the two IaC pillars end to end: Terraform for declarative provisioning (basics → modules → remote state/locking) and Ansible for configuration management (core → Galaxy for reusable roles).

| Tool/Concept | What it is & its role | Official documentation |
|---|---|---|
| **Terraform** | HashiCorp's declarative infrastructure-as-code tool: define infrastructure in HCL, then plan/apply changes across any cloud or on-prem provider through one workflow. **License note (verified against the `hashicorp/terraform` GitHub `LICENSE` file directly):** since v1.6.0 (Aug 2023) Terraform ships under the Business Source License 1.1 (BUSL), not the prior open-source MPL 2.0; each version converts to MPL 2.0 four years after release. The [OpenTofu](https://opentofu.org) project (Linux Foundation) forked the last MPL-licensed codebase as the fully open-source alternative — worth noting since a course built around "Terraform" now implicitly means BUSL-licensed tooling. | [developer.hashicorp.com/terraform](https://developer.hashicorp.com/terraform) |
| **Terraform modules** | A module is a set of `.tf` files managed together as one reusable, callable unit (the root module plus any child modules it calls) — how lesson 29 standardizes and shares infra patterns. | [developer.hashicorp.com/terraform/language/modules](https://developer.hashicorp.com/terraform/language/modules) |
| **Terraform S3 backend & state locking** | The S3 backend stores Terraform state remotely so a team shares one source of truth. **Verified change relevant to lesson 30:** as of Terraform 1.10 (Nov 2024) the S3 backend supports native S3 locking (`use_lockfile = true`, via S3 conditional writes) — the older DynamoDB-table locking method is now deprecated in HashiCorp's own docs and slated for future removal, though both can run side by side during migration. A course teaching "S3 backend + state locking" via DynamoDB alone reflects the pre-1.10 mechanism. | [developer.hashicorp.com/terraform/language/backend/s3](https://developer.hashicorp.com/terraform/language/backend/s3) |
| **Ansible** | Red Hat-sponsored, agentless IT automation platform (configuration management, app deployment, orchestration) that pushes modules to managed nodes over plain SSH — no agent software required on targets. Red Hat acquired Ansible in 2015 and sponsors the open-source project since. | [docs.ansible.com](https://docs.ansible.com) |
| **Ansible Galaxy** | The official hub (galaxy.ansible.com) for finding, downloading, and publishing community-built Ansible roles and collections — how lesson 32 jump-starts reusable automation content. | [docs.ansible.com/ansible/latest/galaxy/user_guide.html](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html) |

---

## Phase 5 — Observability (Lessons 33–37)

Five lessons split cleanly into metrics (Prometheus/Grafana/PromQL/Alertmanager) and logs (Loki/Alloy/Promtail, then a separate ELK pass) — no tracing tool is taught here despite lesson 38 name-dropping "tracing demo" (see Progression Analysis).

| Tool/Concept | What it is & its role | Official documentation |
|---|---|---|
| **Prometheus** | Open-source systems-monitoring and alerting toolkit: pulls (scrapes) metrics over HTTP, stores them as multi-dimensional time series in a local TSDB, queried via PromQL. | [prometheus.io/docs/introduction/overview](https://prometheus.io/docs/introduction/overview/) |
| **Node exporter** | Official Prometheus exporter for hardware/OS metrics (CPU, memory, disk, network) on *NIX hosts, written in Go with pluggable collectors, exposing text-format metrics (default port 9100). | [github.com/prometheus/node_exporter](https://github.com/prometheus/node_exporter) |
| **Grafana** | Open-source platform to query, visualize, and alert on metrics/logs/traces from many data sources (Prometheus, SQL/NoSQL, plugins) — the dashboard layer for lesson 34's "build your own dashboard." | [grafana.com/docs/grafana/latest/introduction](https://grafana.com/docs/grafana/latest/introduction/) |
| **PromQL** | Prometheus's own functional query language for selecting and aggregating time series in real time, over instant or range vectors. | [prometheus.io/docs/prometheus/latest/querying/basics](https://prometheus.io/docs/prometheus/latest/querying/basics/) |
| **Alertmanager** | Handles alerts sent by clients such as the Prometheus server: deduplicates, groups, and routes them to receivers (email, PagerDuty, generic webhooks), plus silencing/inhibition. *Note: Alertmanager has no built-in Telegram receiver — lesson 35's "alerts to Telegram" is done via a generic webhook receiver or third-party bridge, not native support.* | [prometheus.io/docs/alerting/latest/alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) |
| **Grafana Loki** | Horizontally scalable, multi-tenant log-aggregation system "inspired by Prometheus" — it indexes only labels/metadata (not full log text), keeping compressed log content in object storage, which is cheaper to scale than full-text indexing. | [grafana.com/docs/loki/latest](https://grafana.com/docs/loki/latest/) |
| **Grafana Alloy** | Grafana Labs' vendor-neutral distribution of the OpenTelemetry Collector — a single unified agent for metrics, logs, traces, and profiles, and the official migration target for both Grafana Agent and Promtail. | [grafana.com/docs/alloy/latest](https://grafana.com/docs/alloy/latest/) |
| **Promtail** | Log-shipping agent for Loki. **Verified directly from its own doc page: officially end-of-life as of March 2, 2026** — "commercial support has ended... all future feature development will occur in Grafana Alloy." Users are told to migrate to Alloy. Since the course teaches Promtail and Alloy in the same lesson (36) as if parallel options, and Promtail's stated EOL has now passed (today is 2026-07-18), this pairing is stale versus Grafana's own current guidance — Alloy is the mandated replacement, not a peer. | [grafana.com/docs/loki/latest/send-data/promtail](https://grafana.com/docs/loki/latest/send-data/promtail/) |
| **Elasticsearch** | Core search/analytics engine of the Elastic Stack — stores, indexes, and queries data near-real-time at scale. | [elastic.co/guide — Elasticsearch intro](https://www.elastic.co/guide/en/elasticsearch/reference/current/elasticsearch-intro.html) |
| **Logstash** | Open-source data-collection engine with real-time pipelining: ingest via input plugins, transform via filters, ship via output plugins. | [elastic.co/guide — Logstash intro](https://www.elastic.co/guide/en/logstash/current/introduction.html) |
| **Kibana** | The UI layer for the Elastic Stack: ad hoc data exploration (Discover), visualizations/dashboards, and stack management. | [elastic.co/guide — Kibana intro](https://www.elastic.co/guide/en/kibana/current/introduction.html) |

---

## Phase 6 — Kubernetes (Lessons 38–52)

Fifteen lessons — the largest phase — staged deliberately from *workload objects* → *cluster bring-up* → *storage* → *ingress/TLS* → *GitOps delivery* → *scheduling & efficiency*. The trainee first runs objects on a managed/dev cluster (38–41), then builds a real HA cluster by hand with `kubeadm` (42–44), exposes it (45–47), delivers to it via GitOps (48–49, 52), and finally controls scheduling and resource behaviour (50–51).

| Tool/Concept | What it is & its role | Official documentation |
|---|---|---|
| **Kubernetes** | Open-source container-orchestration platform (CNCF Graduated) that schedules containers across a cluster and continuously reconciles actual state toward declared desired state. | [kubernetes.io/docs — overview](https://kubernetes.io/docs/concepts/overview/) |
| **ReplicaSet / Deployment / rolling update** | A Deployment declares a desired Pod template + replica count and manages ReplicaSets under the hood; updates roll out incrementally (surge/unavailable bounded) with automatic rollback support — lesson 39. | [kubernetes.io — Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) |
| **DaemonSet / StatefulSet / Job / CronJob** | The non-Deployment workload controllers: one-Pod-per-node (DaemonSet), stable identity + ordered storage (StatefulSet), run-to-completion (Job), and scheduled Jobs (CronJob) — lesson 40. | [kubernetes.io — Workloads](https://kubernetes.io/docs/concepts/workloads/controllers/) |
| **Services (ClusterIP/NodePort/LoadBalancer/ExternalName)** | Stable network endpoint + load balancing across a Pod set; the four types move exposure from cluster-internal → node port → external LB → CNAME alias — lessons 40–41. | [kubernetes.io — Service](https://kubernetes.io/docs/concepts/services-networking/service/) |
| **kubeadm** | The official tool for bootstrapping a conformant cluster (init control plane, join nodes) — lesson 42's "create a cluster with kubeadm." | [kubernetes.io — kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/) |
| **Storage: PV / PVC / StorageClass / CSI** | Persistent storage abstraction: an admin/dynamic PV is claimed by a PVC; StorageClass drives dynamic provisioning; CSI is the plugin interface storage vendors implement — lesson 43. NFS provides the shared backend in lesson 44. | [kubernetes.io — Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) · [CSI](https://kubernetes-csi.github.io/docs/) |
| **Control-plane HA (Keepalived + HAProxy)** | A VIP (Keepalived/VRRP) fronting HAProxy load-balances traffic across multiple `kube-apiserver` replicas so the API stays available if a control-plane node fails — lesson 45. | [keepalived.org](https://www.keepalived.org/) · [haproxy.org](https://www.haproxy.org/) |
| **Ingress + Ingress-NGINX + MetalLB** | Ingress is L7 HTTP routing rules; Ingress-NGINX is the controller that implements them; MetalLB provides `LoadBalancer`-type Services on bare-metal clusters that lack a cloud LB — lesson 45. | [kubernetes.io — Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) · [ingress-nginx](https://kubernetes.github.io/ingress-nginx/) · [metallb.io](https://metallb.io/) |
| **ConfigMap / Secret / cert-manager** | Config and secret injection into Pods; cert-manager automates X.509 issuance/renewal (Let's Encrypt via HTTP01 & DNS01 challenges) — lessons 46–47. | [cert-manager.io](https://cert-manager.io/docs/) |
| **ExternalDNS** | Syncs Ingress/Service hostnames into a DNS provider automatically (DigitalOcean in lesson 47) so DNS records track cluster state. | [kubernetes-sigs/external-dns](https://kubernetes-sigs.github.io/external-dns/) |
| **GitOps / ArgoCD (pull vs push, App-of-Apps)** | ArgoCD continuously reconciles a cluster to manifests in Git (pull model), versus `kubectl apply` from CI (push model); App-of-Apps is a bootstrap pattern where one Argo Application manages many — lessons 48–49, 52. | [argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/) |
| **Readiness / liveness probes** | Liveness restarts a hung container; readiness gates a Pod out of Service endpoints until healthy — lesson 49. | [kubernetes.io — probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) |
| **Affinity / anti-affinity, requests & limits** | Scheduling constraints (node/pod affinity) plus per-container CPU/memory requests (scheduling) and limits (enforcement) — lesson 50. | [kubernetes.io — assign pods](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/) · [resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) |
| **PodDisruptionBudget, cordon/drain** | PDB caps how many Pods of a workload may be voluntarily disrupted at once; cordon/drain safely evict a node for maintenance — lesson 51. | [kubernetes.io — disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) · [safely drain a node](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/) |
| **Operators (CloudNativePG) + Volume Snapshots** | Operators encode operational knowledge for stateful apps as controllers; CloudNativePG runs HA PostgreSQL on K8s; VolumeSnapshots capture point-in-time PV state — lessons 51–52. | [kubernetes.io — Operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) · [cloudnative-pg.io](https://cloudnative-pg.io/documentation/) |
| **Taints & tolerations** | Taints repel Pods from nodes unless the Pod carries a matching toleration — the inverse of affinity, used to reserve nodes — lesson 52. | [kubernetes.io — taints & tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) |

---

## Phase 7 — Secrets, Security, Scaling (Lessons 53–58)

Six lessons that finally close the loop between everything Phase 6 built (a running cluster) and production hardening: secrets never live in Git or plain K8s Secrets (Vault + ESO), access is least-privilege (RBAC + NetworkPolicy), and workloads scale to real event-driven load (HPA/Cluster Autoscaler/KEDA) rather than fixed replica counts — capped with a full from-scratch rebuild (lesson 57) that integrates all of it, then a dedicated Celery-autoscaling/cost-optimization capstone (lesson 58).

| Tool/Concept | What it is & its role | Official documentation |
|---|---|---|
| **HashiCorp Vault** | Centralized secrets-management platform: stores/brokers tokens, passwords, certificates, and encryption keys, authorizing every request against path-based, deny-by-default ACL policies. HA requires a coordinating storage backend — Integrated Storage (Raft consensus, HashiCorp's recommended default) or Consul — which is lesson 53's "High Available setup." **License note**: since v1.15 (Aug 2023), Vault's source is Business Source License 1.1 (BUSL), confirmed in the `hashicorp/vault` GitHub `LICENSE` file — the same licensing shift as Terraform. | [developer.hashicorp.com/vault](https://developer.hashicorp.com/vault/docs/what-is-vault) |
| **Vault-to-Kubernetes integration** | Two officially documented mechanisms let pods consume Vault secrets without app code changes: the Vault Agent Injector (a mutating webhook injecting a sidecar) and the Vault CSI Provider (mounts secrets as a CSI volume); a newer Vault Secrets Operator syncs secrets as native K8s Secret objects — lesson 54's topic. | [developer.hashicorp.com/vault/docs/platform/k8s](https://developer.hashicorp.com/vault/docs/platform/k8s) |
| **External Secrets Operator (ESO)** | Kubernetes operator that reads secrets from external systems (Vault plus 40+ cloud/secret-manager providers) and syncs them into native Kubernetes Secret objects. Independent open source (Apache 2.0, started at GoDaddy/Container Solutions) — not a HashiCorp product. Currently a **CNCF Sandbox** project (accepted July 2022; not yet Incubating/Graduated). | [external-secrets.io](https://external-secrets.io/latest/) |
| **Kubernetes NetworkPolicy** | Namespaced resource controlling L3/L4 ingress/egress traffic to and from Pods via label selectors; Pods are non-isolated by default until a NetworkPolicy selects them, and enforcement requires a CNI plugin that implements it — lesson 54. | [kubernetes.io — Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) |
| **Kubernetes RBAC** | Access-control mechanism (`rbac.authorization.k8s.io` API group) using Role/ClusterRole to define permissions and RoleBinding/ClusterRoleBinding to grant them to users, groups, or service accounts; rules are purely additive, with no explicit deny — lesson 54. | [kubernetes.io — RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) |
| **Horizontal Pod Autoscaler (HPA)** | Controller/API resource that automatically adjusts a Deployment/StatefulSet's replica count from observed metrics (CPU, memory, or custom/external), recalculating roughly every 15 seconds. | [kubernetes.io — HPA](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/) |
| **Cluster Autoscaler** | Component in the `kubernetes/autoscaler` repo that adds nodes when pods can't schedule due to insufficient cluster resources, and removes nodes that are sustainedly underutilized — it scales the node pool that HPA-scaled pods land on. | [github.com/kubernetes/autoscaler — cluster-autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) |
| **KEDA (Kubernetes Event-Driven Autoscaling)** | Single-purpose autoscaler extending HPA to scale on external event-source metrics (queue depth, Kafka consumer lag, Redis, cloud metrics) instead of only CPU/memory — precisely what lesson 58 needs for Celery-worker autoscaling off a Redis queue. **CNCF Graduated** (Aug 22, 2023) — the highest CNCF maturity tier, same as Kubernetes itself. | [keda.sh/docs](https://keda.sh/docs/latest/) |
| **Helm** | The package manager for Kubernetes: a chart bundles templated manifests plus configurable values into one versioned, installable/upgradable unit — lesson 55's "writing your own Helm chart." | [helm.sh/docs](https://helm.sh/docs/) |
| **Kubernetes Finalizers** | Namespaced keys in `metadata.finalizers` that block a resource's actual deletion until its owning controller clears them; deleting a finalized object sets a `deletionTimestamp` but the object hangs in "Terminating" state forever if the controller never removes its finalizer — precisely the "hanging resources" failure mode lesson 56 debugs. | [kubernetes.io — Finalizers](https://kubernetes.io/docs/concepts/overview/working-with-objects/finalizers/) |

*Note: ESO (Sandbox) and KEDA (Graduated) sit at very different CNCF maturity levels despite being taught back-to-back in lesson 54/55 — worth knowing the difference in project risk before betting production secrets-sync on the less mature of the two.*

---

## Phase 8 — Private Infrastructure (Lessons 59–73)

The payoff phase and the course's genuine standout: 15 lessons (>20% of the course) rebuilding, on bare metal the trainee networks and secures themselves, the managed-service equivalents used earlier — a self-hosted registry, object store, identity provider, Kubernetes platform, and HA database. Sequenced cloud-analog-first: the trainee already knows *what* each component does from Phases 2–7; Phase 8 relocates it onto hardware they must also firewall, segment, and virtualize.

| Tool/Concept | What it is & its role | Official documentation |
|---|---|---|
| **pfSense** | FreeBSD-based open-source firewall/router distribution; configured from zero as DHCP/DNS/NTP/gateway and OpenVPN server, and as the segmentation boundary for the private network — lessons 61–64. | [docs.netgate.com/pfsense](https://docs.netgate.com/pfsense/en/latest/) |
| **VLAN / VXLAN segmentation** | L2 network isolation: VLAN tags frames within a switched domain (802.1Q); VXLAN tunnels L2 over L3 (RFC 7348) for larger overlay networks — the theory behind lesson 63's physical vs. virtual segmentation with pfSense + OpenNebula. | [RFC 7348 (VXLAN)](https://datatracker.ietf.org/doc/html/rfc7348) · [OpenNebula docs](https://docs.opennebula.io/) |
| **RKE2** | Rancher's security-focused, CNCF-conformant Kubernetes distribution (FIPS-capable, CIS-hardened); the self-hosted cluster substrate in lessons 60, 65. | [docs.rke2.io](https://docs.rke2.io/) |
| **Rancher** | Multi-cluster Kubernetes management platform: installed HA on a 3-node RKE2 cluster, then provisions and governs downstream clusters — lessons 60, 65–66. | [ranchermanager.docs.rancher.com](https://ranchermanager.docs.rancher.com/) |
| **Keycloak + OIDC** | Open-source IAM (SSO, OIDC/SAML, federation, RBAC); wired as the identity provider for ArgoCD, Harbor, MinIO, and Rancher — lessons 66–69, 71. **Accuracy flag:** Keycloak was accepted into the **CNCF as an Incubating project on 2023‑04‑11** (commonly misdated to 2024); it remains Incubating (not Graduated) and is no longer solely Red Hat–governed. | [keycloak.org/documentation](https://www.keycloak.org/documentation) · [cncf.io/projects/keycloak](https://www.cncf.io/projects/keycloak/) · [OIDC Core spec](https://openid.net/specs/openid-connect-core-1_0.html) |
| **Harbor (+ Trivy)** | CNCF-graduated OCI registry with RBAC, replication, proxy-cache (locally caches upstream pulls to dodge rate limits), and robot accounts (non-interactive per-project service credentials); Trivy is its default vulnerability scanner — lessons 59, 69–70. | [goharbor.io/docs](https://goharbor.io/docs/) · [trivy.dev](https://trivy.dev/) |
| **MinIO** | S3-compatible object-storage server; used as Harbor's image backend and etcd-backup target — lesson 70–72. **Accuracy flag:** MinIO's core has been **AGPLv3 since 2021** (verifiable, official); separately, in **2025** MinIO removed admin/IAM features from the free Community Edition console and rebranded docs toward the paid **AIStor** product (`min.io/docs` now redirects to the AIStor docs). Reports of the Community Edition entering "maintenance mode" are **secondary-sourced** (tech press, not an official MinIO post) — treat that specific claim as unverified. | [AGPLv3 license announcement](https://www.min.io/blog/from-open-source-to-free-and-open-source-minio-is-now-fully-licensed-under-gnu-agplv3) · [current docs (AIStor)](https://docs.min.io/enterprise/aistor-object-store/) |
| **Sonatype Nexus** | Artifact/binary repository manager (Maven, npm, Docker, PyPI…); free Community Edition (replaced legacy "OSS" ~v3.77) vs. paid Pro — lessons 71–72. *(Author notes the video recording cut off mid-lesson 71; written install steps were provided.)* | [help.sonatype.com — Nexus Repository](https://help.sonatype.com/en/sonatype-nexus-repository.html) |
| **HA PostgreSQL: Patroni + etcd + HAProxy + Keepalived** | Production Postgres HA: Patroni orchestrates leader election/failover using etcd as the DCS; HAProxy routes clients to the current primary; Keepalived floats the VIP. Switchover = planned leader change (REST API); `synchronous_mode` supports off/on/quorum — lessons 72–73 (revisiting lesson 19). | [patroni.readthedocs.io](https://patroni.readthedocs.io/) · [etcd recovery](https://etcd.io/docs/latest/op-guide/recovery/) · [PG streaming replication](https://www.postgresql.org/docs/current/warm-standby.html) |
| **Barman / pgBackRest** | The two mainstream PostgreSQL backup/PITR tools: Barman (EDB, GPLv3) centralizes multi-server backup catalogs; pgBackRest (MIT) does parallel full/diff/incremental backups with encryption and cloud targets — lesson 73. | [pgbarman.org](https://pgbarman.org/) · [pgbackrest.org](https://pgbackrest.org/) |
| **etcd backup to S3** | Cluster state (etcd) is snapshotted (`etcdctl snapshot save`) and shipped to MinIO S3 for disaster recovery of the Rancher/RKE2 cluster — lesson 72. | [etcd — disaster recovery](https://etcd.io/docs/latest/op-guide/recovery/) |

*Note on citations: the Phase-8 tool descriptions above were verified against each tool's own official documentation; the two **accuracy flags** (Keycloak's CNCF date, MinIO's 2025 licensing/console changes) mark facts that are commonly misstated or are recent enough to re-verify before relying on them.*

---

## Coverage & Progression Analysis

**Ordering is pedagogically sound, and unusually disciplined about it.** The spine follows a strict "run it by hand before you automate it" rule at every layer transition:

- Lessons 1–10 force manual Linux administration, manual networking (routing/NAT/firewall), and manual app deployment (Nginx + Certbot + WSGI/PHP-FPM by hand) *before* lesson 11 introduces Docker. A trainee who has never manually configured `iptables` or reverse-proxied a Django app under Gunicorn would be cargo-culting a Dockerfile; this course doesn't let that happen.
- Docker (11–14) is fully covered — including the harder, less-taught Swarm networking/rolling-update/multi-stage material — *before* any CI/CD tool touches a container (lesson 15+).
- CI/CD (15–26) deliberately over-indexes on repetition across stacks (Django, Django+Celery, Spring, Go/Gin, Node) and engines (GitHub Actions, GitLab CE, Jenkins, TeamCity) rather than depth in any one — this is the "breadth of employability" phase: a graduate can walk into a shop using any of the four dominant CI engines.
- IaC (27–32) arrives only after the trainee has manually built and CI/CD'd real infrastructure — Terraform/Ansible are introduced as *codifying* prior manual work, not as a first encounter with infrastructure concepts.
- Observability (33–37) precedes Kubernetes (38–52) — a deliberate and fairly rare ordering choice. Most courses bolt monitoring onto Kubernetes as an afterthought; here the trainee already knows Prometheus/Grafana/Loki cold before K8s adds its own scale of complexity, so K8s-specific observability (ServiceMonitors, cAdvisor, etc.) is additive rather than foundational.
- Kubernetes (38–52) itself is internally staged from workload objects (39–41) → cluster bring-up via kubeadm (42) → storage (43–44) → ingress/networking/TLS (45–47) → GitOps/delivery (48–49, 52) → scheduling/scaling primitives (50–51) — i.e., "how do I run things" before "how do I automate delivering things" before "how do I make it efficient," which matches how real clusters get built.
- Secrets/Security/Scaling (53–58) is sequenced *after* a working GitOps pipeline exists (ArgoCD from lesson 48+), so Vault-to-K8s and ESO integration land on top of a pipeline that already works, not as an isolated exercise — then lesson 57 forces a from-scratch integration rebuild, a strong "prove you actually learned it" checkpoint.
- Private Infrastructure (59–73) is the payoff phase and is sequenced cloud-analog-first: the trainee already knows what Harbor/RKE2/Rancher/Vault/ArgoCD do *as managed or cloud concepts* from Phases 2–7, and Phase 8 just relocates the same concerns onto bare metal the trainee must also network, virtualize, and secure themselves.

**Where it goes unusually deep:**

1. **HA PostgreSQL, twice.** Lesson 19 introduces Patroni/etcd/HAProxy early (explicitly flagged by the author as lower quality/free), and lessons 72–73 return to the *exact same stack* at the end of the course with switchover testing, sync/async/quorum-sync replica configuration, and Barman/pgBackRest backup — i.e., the course teaches production Postgres HA operations to a depth well beyond "install postgres," bookending the entire curriculum with it.
2. **Private, self-hosted infrastructure (Phase 8) is the standout and genuinely rare for a course at this level.** Going all the way to pfSense firewall/router configuration from zero, hand-built network segmentation (VLAN/VXLAN, OpenNebula), self-hosted Kubernetes (RKE2) with an HA Rancher control plane, self-hosted identity (Keycloak + OIDC wired into ArgoCD/Harbor/MinIO/Rancher RBAC), a self-hosted registry (Harbor with Trivy scanning and S3-backed storage on self-hosted MinIO), and a self-hosted artifact repo (Sonatype Nexus) is a full "build your own cloud provider's managed-service equivalents" exercise. Most DevOps/Kubernetes courses stop at "here's how to use a managed Kubernetes service (EKS/GKE/DOKS)"; this course instead spends 15 of 73 lessons (>20%) proving you can replace every one of those managed services yourself on bare metal.
3. **Identity/auth is unusually thorough for a DevOps (not security) course.** OAuth2/OIDC theory (66) → Keycloak on K8s via operator (67) → ArgoCD OIDC login (68) → RBAC group-sync from Keycloak (69) → MinIO/Rancher OIDC integration (71) is a five-lesson arc on a single-sign-on architecture most courses treat as a one-slide aside.

**Where it skims:**

1. **Distributed tracing is named but never taught.** Lesson 38 mentions a "tracing demo" in passing before pivoting immediately to Kubernetes introduction — no tracing tool (Jaeger, Tempo, Zipkin, OpenTelemetry) is named anywhere else in the 73-lesson list. Given Phase 5 otherwise thoroughly covers metrics + logs, tracing is the missing third pillar of observability — the course teaches 2 of the 3 legs of the "MELT" stool.
2. **CI/CD engine breadth trades off against CI/CD engine depth.** Covering GitHub Actions, GitLab CE, Jenkins, *and* TeamCity in the same phase (versus, say, going deep on one plus general CI concepts) means each individual engine likely gets only introductory treatment — reasonable for employability breadth, but it means no engine is covered to the depth Docker or Kubernetes are.
3. **Networking theory front-loads OSI/subnetting (lesson 6) then reappears only in Phase 8 (hub/switch/router L2 vs L3, lesson 61)** — a nine-phase gap between "why CIDR" and "how a switch actually forwards frames," rather than building networking as one continuous arc.
4. **No cloud-provider-native services are taught** (no managed K8s walkthrough, no managed database, no cloud IAM) beyond using DigitalOcean as a cheap generic host (lessons 47, 57) and an external-DNS provider (47) — consistent with the course's self-hosted philosophy, but means graduates leave without hands-on AWS/GCP/Azure service experience, which many job postings still name explicitly.
5. **Security scanning is a single tool, late and narrow.** Trivy appears exactly once (lesson 70), scoped to Harbor's registry vulnerability scanning — no SAST, no dependency scanning in CI pipelines (Phase 3), no policy engines (OPA/Kyverno) despite Phase 6/7 being deep enough on Kubernetes to have room for one.

---

## Complementarity with the Deep Mastery Plan

The Deep Mastery Plan ("v3 · Course Edition — Backend/Fullstack Systems Engineer," 364 days / 52 weeks, 13 modules) is a from-scratch, build-it-yourself systems curriculum (C, Go, Node/TS) whose only ops-adjacent module is **Module 10 — "Containers, Kubernetes, Observability" (Weeks 39–42, 4 weeks)**. That module's actual content, read directly from `plan.json`:

- Building a **container runtime from raw syscalls** (namespaces, cgroups, chroot, OCI/containerd model) — a CodeCrafters build, not an ops workflow.
- **CKA-level Kubernetes** (architecture, reconciliation loops, scheduling, CNI) via Mumshad Mannambeth's course — conceptual/administrative, not GitOps or production hardening.
- **Prometheus + Grafana + PromQL + alerting + SLI/SLO**, and **OpenTelemetry tracing + Jaeger** — instrumenting the student's own Redis/Kafka/Go-API clones.
- Docker basics/Swarm via Bret Fisher's "Docker Mastery" course, used mainly for image-layer/union-filesystem context for the from-scratch runtime build.

That is 4 weeks out of 52 — deliberately light, because the plan's center of gravity is elsewhere (Modules 1–9, 11–12: OS internals, networking-from-scratch, Go/Node depth, Postgres/Redis internals via build-your-own, Kafka/RabbitMQ, gRPC/Envoy, system design, capstone). The DevOps course is 73 lessons entirely dedicated to the operations discipline the plan only touches once.

### Where they overlap (and how the depth differs)

| Topic | Deep Mastery Plan (Module 10) | DevOps course | Relationship |
|---|---|---|---|
| Docker | Image-layer/union-fs theory via Bret Fisher, in service of building a runtime from syscalls | 4 full lessons: images/volumes/Compose/networking/Swarm/registry/multi-stage/scratch | DevOps course is the *practitioner* depth; Deep Mastery plan goes one level *below* Docker (the kernel primitives Docker is built on) — genuinely complementary, not redundant. |
| Kubernetes core objects | CKA-level: architecture, scheduling, CNI, reconciliation loops (conceptual + labs) | 15 lessons: same core objects plus full cluster bring-up (kubeadm), storage/CSI, ingress/cert-manager, GitOps (ArgoCD), autoscaling, operators | Real overlap on core object semantics (Deployment, Service, scheduling) — DevOps course goes far past CKA scope into GitOps, secrets, and HA cluster networking that Module 10 never touches. |
| Prometheus/Grafana/PromQL | Full sub-topic: instrumenting own services, PromQL, alerting, SLI/SLO | Full sub-topic: Grafana/Prometheus/Node exporter/PromQL/Alertmanager→Telegram | Near-total overlap — both treat this seriously. Minor gap: Deep Mastery plan explicitly frames SLI/SLO/RED/USE patterns; DevOps course's Alertmanager lesson is more ops-routing-focused (routing alerts to Telegram) than SLO-framework-focused. |
| Distributed tracing | OpenTelemetry + Jaeger, explicitly built and stress-tested | Named once ("tracing demo," lesson 38) then dropped | **Deep Mastery Plan covers what the DevOps course skims.** This is the one place the plan is strictly deeper than the course. |
| Logging (Loki/ELK) | Not covered at all in Module 10 | Full lesson each: Loki/Alloy/Promtail (36) and ELK (37) | **DevOps course fills a real gap** — the Deep Mastery Plan has no logging-stack content anywhere in its 13 modules. |

### Where the DevOps course extends far beyond the plan (the plan's real ops gaps)

These are areas the 364-day Deep Mastery Plan does not cover **at all**, in any module, which the DevOps course supplies wholesale:

- **CI/CD as a discipline** (Phase 3, 12 lessons): GitHub Actions, GitLab CE, Jenkins, TeamCity, self-hosted runners, reusable workflows. The plan has zero CI/CD-tooling content — Module 3's build "#6" mentions "CI" only as a bullet point ("Docker + CI"), never expanded into its own module.
- **Infrastructure as Code** (Phase 4, 6 lessons): Terraform (HCL, modules, remote state/locking) and Ansible (config management, Galaxy). Not present anywhere in the plan.
- **GitOps/progressive delivery** (Phase 6, lessons 48–49, 52): ArgoCD, push-vs-pull deployment models, App-of-Apps. The plan's Module 10 stops at "run kubectl against a cluster" — it never introduces a GitOps controller.
- **Kubernetes production hardening**: Ingress + cert-manager + ExternalDNS (TLS automation), NetworkPolicy + RBAC (least privilege), HPA + Cluster Autoscaler + KEDA (event-driven autoscaling), PodDisruptionBudget/cordon-drain (safe node maintenance), Operators/CloudNativePG (stateful workloads on K8s). Module 10's CKA content covers *scheduling theory* but none of these production concerns.
- **Secrets management** (Phase 7): HashiCorp Vault (install, ACL policies, HA) and External Secrets Operator. Entirely absent from the plan — the plan's services use JWT/env-based auth (Module 3's build uses "JWT"), never a secrets-manager pattern.
- **Self-hosted platform infrastructure** (Phase 8, 15 lessons): pfSense firewall/routing, VLAN/VXLAN segmentation, RKE2/Rancher, Keycloak/OIDC identity, Harbor registry + Trivy scanning, MinIO object storage, Sonatype Nexus. None of this exists in the Deep Mastery Plan at any point — the plan is entirely about writing software, never about hosting the platform that software runs on.
- **HA PostgreSQL operations** (lessons 19, 72–73): Patroni/etcd/HAProxy/Keepalived, switchover testing, replica topology, Barman/pgBackRest backups. The plan's Module 5 goes deep on Postgres *internals* (B-trees, MVCC, WAL, query planner) via a build-your-own database — genuinely complementary rather than overlapping, since the plan teaches *why* WAL-based replication works and the DevOps course teaches *how to operate* a WAL-replicated HA cluster in production.
- **Foundational sysadmin/networking-as-operations** (Phase 1): Linux user/package/filesystem administration, NAT/firewall/VPN/WireGuard configuration, Nginx+Certbot+WSGI/PHP-FPM manual deployment. The plan's Module 2 covers networking *protocol internals* (OSI/TCP-IP, sockets, HTTP from scratch) via from-scratch builds — again complementary depth, not redundant: the plan teaches how TCP/HTTP work by building them; the DevOps course teaches how to administer and secure a box that runs them.

### Net assessment

The two curricula are close to perfectly complementary with almost no wasted repetition: the Deep Mastery Plan goes *down* (syscalls, protocol internals, database/cache internals via build-your-own) where the DevOps course goes *up and out* (operating real CI/CD pipelines, IaC, GitOps, secrets, autoscaling, and — uniquely — an entire self-hosted private-cloud stack). A graduate of both would have production-operations breadth (DevOps course) layered on top of first-principles systems depth (Deep Mastery Plan) — the DevOps course's Phases 3, 4, 7, and 8 are the plan's most significant gap-fillers, and the plan's OpenTelemetry/Jaeger tracing work is the one thing it teaches that the DevOps course does not.

---

## Full Lesson-Coverage Table

| # | Topic | Primary tools | Phase |
|---|---|---|---|
| 1 | Introduction, course syllabus | — | Foundations |
| 2 | Basic Linux commands | Linux | Foundations |
| 3 | Linux (continued) | Linux | Foundations |
| 4 | Linux users, package management, filesystems | Linux | Foundations |
| 5 | Git, GitHub, networking introduction | Git, GitHub | Foundations |
| 6 | Networking: OSI model, public/private IP, IPv4/IPv6, subnetting, CIDR | IPv4, IPv6, CIDR | Foundations |
| 7 | Networking: routing, NAT (SNAT), firewall | iptables/nftables | Foundations |
| 8 | VPN, WireGuard, Ubuntu initial setup, Nginx | WireGuard, Nginx | Foundations |
| 9 | App deployment: Nginx, Certbot, Node.js, Python, Django | Nginx, Certbot, Django | Foundations |
| 10 | App deployment: Django WSGI, PHP Laravel with PHP-FPM | Django, PHP-FPM, Laravel | Foundations |
| 11 | Docker: containers, images, volumes | Docker | Docker |
| 12 | Docker continued: Dockerfile, Compose, network, volumes | Docker, Docker Compose | Docker |
| 13 | Docker Swarm, container registry, image layers, cache | Docker Swarm, Docker Registry | Docker |
| 14 | Swarm networking, rolling update, LB, multi-stage build, scratch image | Docker Swarm | Docker |
| 15 | CI/CD: automation for manual & Docker deployment | CI/CD (generic) | CI/CD |
| 16 | CI/CD: Python, Django, PostgreSQL | PostgreSQL | CI/CD |
| 17 | CI/CD: Django + Docker + Nginx + Postgres (separate host) + LB, production deploy | Docker, Nginx, PostgreSQL | CI/CD |
| 18 | CI/CD: HA app deploy, Raft protocol | Raft | CI/CD |
| 19 | Postgres HA setup: Patroni, etcd, HAProxy (free lesson) | Patroni, etcd, HAProxy | CI/CD |
| 20 | Django + Celery + Redis | Celery, Redis | CI/CD |
| 21 | Java Spring: 2 microservices with Postgres, CI/CD | Spring, PostgreSQL | CI/CD |
| 22 | GitHub Actions reusable workflows; Go/Gin CI/CD; Node.js websocket demo | GitHub Actions, Gin | CI/CD |
| 23 | GitHub Actions self-hosted runners; GitLab CE CI/CD, self-hosted runners | GitHub Actions, GitLab CE | CI/CD |
| 24 | GitLab CE: registry, tagged runners, Telegram notifications, webhooks, object storage, package repos, feature flags | GitLab CE | CI/CD |
| 25 | CI/CD: Jenkins | Jenkins | CI/CD |
| 26 | CI/CD: TeamCity | TeamCity | CI/CD |
| 27 | Infrastructure as Code: Terraform | Terraform | IaC |
| 28 | Terraform (continued) | Terraform | IaC |
| 29 | Terraform modules | Terraform | IaC |
| 30 | Terraform backend with S3 + state locking | Terraform | IaC |
| 31 | Infrastructure as Code: Ansible | Ansible | IaC |
| 32 | Ansible Galaxy; virtual lab overview | Ansible Galaxy | IaC |
| 33 | Monitoring: Grafana, Prometheus, Node exporter | Prometheus, Grafana, Node exporter | Observability |
| 34 | Custom Grafana dashboard, PromQL | Grafana, PromQL | Observability |
| 35 | Alertmanager, alerts to Telegram, tmux/system load | Alertmanager | Observability |
| 36 | Logging: Grafana Loki, Alloy, Promtail | Loki, Alloy, Promtail | Observability |
| 37 | Logging: ELK Stack (Elasticsearch, Logstash, Kibana) | ELK | Observability |
| 38 | Tracing demo (brief); Kubernetes introduction | Kubernetes | Kubernetes |
| 39 | Kubernetes: ReplicaSet, Deployment, rolling update | Kubernetes | Kubernetes |
| 40 | Kubernetes: DaemonSet, StatefulSet, Job, CronJob, Services (ClusterIP) | Kubernetes | Kubernetes |
| 41 | Kubernetes Services: ClusterIP, NodePort, LoadBalancer, ExternalName | Kubernetes | Kubernetes |
| 42 | Kubeadm cluster creation, namespaces | kubeadm | Kubernetes |
| 43 | Kubernetes storage: Volume, PV, PVC, StorageClass, CSI | Kubernetes storage | Kubernetes |
| 44 | Kubernetes HA setup, NFS storage | NFS | Kubernetes |
| 45 | LB for K8s API server (Keepalived + HAProxy), Ingress, Ingress-NGINX, MetalLB | Keepalived, HAProxy, Ingress-NGINX, MetalLB | Kubernetes |
| 46 | Ingress, ConfigMap, Secret, cert-manager | cert-manager | Kubernetes |
| 47 | Ingress + cert-manager (HTTP01/DNS01), ExternalDNS with DigitalOcean | cert-manager, ExternalDNS | Kubernetes |
| 48 | Pull vs push deployment; GitOps: ArgoCD architecture | ArgoCD | Kubernetes |
| 49 | CI/CD for K8s: push (kubectl) vs pull (ArgoCD); readiness/liveness probes | ArgoCD | Kubernetes |
| 50 | Affinity/anti-affinity; CPU/memory requests & limits | Kubernetes scheduling | Kubernetes |
| 51 | PodDisruptionBudget; cordon/drain; Operators; CloudNativePG demo; volume snapshots intro | CloudNativePG | Kubernetes |
| 52 | Volume snapshots; ArgoCD App-of-Apps; taints and tolerations | ArgoCD | Kubernetes |
| 53 | Secrets: HashiCorp Vault install, ACL policies, HA setup | HashiCorp Vault | Secrets/Security/Scaling |
| 54 | Vault-to-K8s integration; External Secrets Operator; NetworkPolicy; RBAC | ESO, NetworkPolicy, RBAC | Secrets/Security/Scaling |
| 55 | Autoscaling: HPA, Cluster Autoscaler, KEDA; own Helm chart | HPA, Cluster Autoscaler, KEDA, Helm | Secrets/Security/Scaling |
| 56 | Migrate Helm charts to ArgoCD; debug hanging resources/finalizers | ArgoCD, finalizers | Secrets/Security/Scaling |
| 57 | Full K8s infra from zero on DigitalOcean; Django + Vault; Celery configs | Vault, Celery | Secrets/Security/Scaling |
| 58 | Celery autoscaling with Redis + KEDA + Cluster Autoscaler; cost optimization | KEDA, Cluster Autoscaler | Secrets/Security/Scaling |
| 59 | Private infra intro; Ansible role; Harbor install via Ansible | Harbor, Ansible | Private Infra |
| 60 | Network divide theory (firewall/VLAN/VXLAN); K8s certified distros; RKE2 intro/setup; Rancher intro | RKE2, Rancher | Private Infra |
| 61 | Networking: hub/switch/router, L2 vs L3 switch; pfSense setup from zero | pfSense | Private Infra |
| 62 | pfSense config: DHCP, gateway, DNS, NTP; broadcast domain; Linux bridge | pfSense | Private Infra |
| 63 | Network segmentation with pfSense + OpenNebula (physical & VLAN) | pfSense, OpenNebula | Private Infra |
| 64 | pfSense OpenVPN setup; break/fix interfaces; ready network | pfSense, OpenVPN | Private Infra |
| 65 | Rancher HA install on 3-node RKE2; Rancher functionality; downstream cluster provisioning | Rancher, RKE2 | Private Infra |
| 66 | Rancher downstream provisioning; OAuth/OIDC intro; infra cluster setup | Rancher, OIDC | Private Infra |
| 67 | Keycloak on K8s via operator; CPU passthrough fix | Keycloak | Private Infra |
| 68 | Keycloak + ArgoCD integration; OIDC workflow explained | Keycloak, ArgoCD, OIDC | Private Infra |
| 69 | ArgoCD RBAC sync with Keycloak groups; HA LB (HAProxy + Keepalived); Harbor in K8s + Keycloak auth | ArgoCD, Keycloak, Harbor, HAProxy, Keepalived | Private Infra |
| 70 | Harbor: registry, proxy cache, robot account, Trivy scan; MinIO S3: architecture, RAID 0/1/5/6, K8s deploy, UI | Harbor, Trivy, MinIO | Private Infra |
| 71 | Keycloak OIDC → MinIO + Rancher; Harbor storage → S3 MinIO; Sonatype Nexus setup | Keycloak, MinIO, Nexus | Private Infra |
| 72 | Nexus config; etcd backup to MinIO S3; HA Postgres theory (Patroni/etcd/HAProxy/Keepalived) part 1 | Nexus, etcd, Patroni | Private Infra |
| 73 | Postgres HA: HAProxy config, switchover test, sync/async/standby replicas, Barman/pgBackRest backup | Patroni, Barman, pgBackRest | Private Infra |

---

## Sources

Every tool description above is cited inline to that tool's **own official documentation**. The primary-source doc homes referenced, by phase:

**Course source:** [DevOps kurs o'tilgan darslar ro'yxati — Mirafzal Shavkatov (telegra.ph, 2025-10-10)](https://telegra.ph/DevOps-kurs-otilgan-darslar-royxati-10-10) *(the 73-lesson list this analysis is built on)*

**Foundations & networking:** [git-scm.com](https://git-scm.com/doc) · [nginx.org/docs](https://nginx.org/en/docs/) · [eff-certbot.readthedocs.io](https://eff-certbot.readthedocs.io/) · [wireguard.com](https://www.wireguard.com/)

**Containers:** [docs.docker.com](https://docs.docker.com/) · [Compose](https://docs.docker.com/compose/) · [Swarm](https://docs.docker.com/engine/swarm/)

**CI/CD:** [docs.github.com/actions](https://docs.github.com/actions) · [docs.gitlab.com/ee/ci](https://docs.gitlab.com/ee/ci/) · [jenkins.io/doc](https://www.jenkins.io/doc/) · [jetbrains.com/help/teamcity](https://www.jetbrains.com/help/teamcity/)

**IaC:** [developer.hashicorp.com/terraform](https://developer.hashicorp.com/terraform/docs) · [docs.ansible.com](https://docs.ansible.com/)

**Observability:** [prometheus.io/docs](https://prometheus.io/docs/) · [grafana.com/docs](https://grafana.com/docs/) · [Loki](https://grafana.com/docs/loki/) · [Alloy](https://grafana.com/docs/alloy/) · [elastic.co/guide](https://www.elastic.co/guide/)

**Kubernetes & delivery:** [kubernetes.io/docs](https://kubernetes.io/docs/) · [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/) · [ingress-nginx](https://kubernetes.github.io/ingress-nginx/) · [metallb.io](https://metallb.io/) · [cert-manager.io](https://cert-manager.io/docs/) · [external-dns](https://kubernetes-sigs.github.io/external-dns/) · [argo-cd.readthedocs.io](https://argo-cd.readthedocs.io/) · [helm.sh/docs](https://helm.sh/docs/) · [cloudnative-pg.io](https://cloudnative-pg.io/documentation/)

**Secrets, security & scaling:** [developer.hashicorp.com/vault](https://developer.hashicorp.com/vault/docs) · [external-secrets.io](https://external-secrets.io/) · [keda.sh/docs](https://keda.sh/docs/) · [github.com/kubernetes/autoscaler](https://github.com/kubernetes/autoscaler)

**Private infrastructure:** [docs.netgate.com/pfsense](https://docs.netgate.com/pfsense/en/latest/) · [docs.rke2.io](https://docs.rke2.io/) · [ranchermanager.docs.rancher.com](https://ranchermanager.docs.rancher.com/) · [docs.opennebula.io](https://docs.opennebula.io/) · [keycloak.org](https://www.keycloak.org/documentation) · [cncf.io/projects/keycloak](https://www.cncf.io/projects/keycloak/) · [openid.net (OIDC Core)](https://openid.net/specs/openid-connect-core-1_0.html) · [goharbor.io/docs](https://goharbor.io/docs/) · [trivy.dev](https://trivy.dev/) · [docs.min.io](https://docs.min.io/) · [help.sonatype.com](https://help.sonatype.com/en/sonatype-nexus-repository.html)

**HA data layer:** [keepalived.org](https://www.keepalived.org/) · [haproxy.org](https://www.haproxy.org/) · [etcd.io/docs](https://etcd.io/docs/) · [patroni.readthedocs.io](https://patroni.readthedocs.io/) · [postgresql.org/docs (warm standby)](https://www.postgresql.org/docs/current/warm-standby.html) · [pgbarman.org](https://pgbarman.org/) · [pgbackrest.org](https://pgbackrest.org/)

> **Accuracy flags (re-verify before relying on):** Keycloak joined the CNCF (Incubating) on **2023-04-11**, not 2024. MinIO's AGPLv3 relicensing (2021) is official; its 2025 Community-Edition console changes / AIStor rebrand are partly official (docs redirect to AIStor) and partly secondary-sourced ("maintenance mode" claim unconfirmed by MinIO directly). RAID levels (0/1/5/6) are a general storage concept (closest standards body: SNIA), not a single vendor doc.

---

*Generated as part of harmonizing the DevOps course into the Deep Mastery Roadmap tracker (DevOps track). Lesson text is transcribed verbatim from the source; tool descriptions are verified against official documentation.*

