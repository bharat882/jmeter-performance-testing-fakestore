# 🧪 Apache JMeter Performance Testing – FakeStore E-Commerce API
**Complete end-to-end performance test suite with baseline, load, and stress testing**

This project is a full performance testing framework designed to simulate realistic user behavior on an e-commerce–style API using **Apache JMeter**. It includes multi-journey scenarios, dynamic data injection, JWT token correlation, SLA assertions, and non-GUI execution with HTML reporting — closely mirroring enterprise-grade performance engineering practices.

---

## 🚀 Project Highlights

- Designed **three end-to-end user journeys**:
  - 🛒 **Anonymous Browsing** (product list, product details, categories)  
  - 🔐 **Login + View Cart** (JWT-based auth + data correlation)  
  - ➕ **Add to Cart** (dynamic JSON payloads using CSV-driven data)
- Built a **realistic workload model** using a 70/20/10 traffic split.  
- Implemented **CSV-driven dynamic test data** for realistic cart creation.  
- Extracted **JWT tokens** using JSON Extractor for authenticated flows.  
- Implemented **SLA assertions** for Response Code and Response Time (p95 targets).  
- Added **think-time** to simulate real user behavior.  
- Executed **Baseline**, **Load (150 VUs)**, and **Stress (300+ VUs)** tests in **non-GUI mode**.  
- Generated **JMeter HTML Dashboards** with percentile charts, throughput graphs, and failure trends.  
- Fully **CI/CD-compatible** using JMeter CLI commands.

---

## 📐 Architecture & Folder Structure

```
/test-plans
   ├── FakeStoreAPI_Perf_Baseline.jmx
   ├── FakeStoreAPI_Perf_LoadTest.jmx
   ├── FakeStoreAPI_Perf_StressTest.jmx

/data
   ├── cart_data.csv

/screenshots
   ├── baseline_dashboard.png
   ├── loadtest_dashboard.png
   ├── stresstest_dashboard.png
```

> The full HTML dashboards are omitted for size; only screenshots are included for readability.

---

## 🔥 User Journeys

### **Journey 1 — Anonymous Browsing**
Endpoints tested:
- `GET /products?limit=20`
- `GET /products/{id}`
- `GET /products/categories`

### **Journey 2 — Login + View Cart**
Steps:
- `POST /auth/login`  
- Extract JWT with JSONPath (`$.token`)  
- `GET /carts/user/{id}` using `Authorization: Bearer ${authToken}`

### **Journey 3 — Add to Cart (Dynamic POST)**
Features:
- CSV-driven userId, product IDs, quantities, dates  
- Dynamic request body generation  
- `POST /carts` (write-heavy API)

---

## 🎛 Load Profiles

### **Baseline Test**
- VUs: **30 total**  
- Duration: **5 minutes**  
- Goal: Validate basic stability under small load

### **Load Test**
- VUs: **150 total**  
- Duration: **8 minutes steady**  
- Goal: Validate performance under expected production traffic  
- Output: JMeter HTML Dashboard

### **Stress Test**
- VUs: **300+ total**  
- Ramp-up: Gradual  
- Goal: Identify breaking point and degradation pattern  
- Output: Throughput/latency/percentile analysis

---

## 🧵 Non-GUI Execution (Command Line)

```bash
jmeter -n -t test-plans/FakeStoreAPI_Perf_LoadTest.jmx        -l loadtest_results.jtl        -e -o reports/loadtest
```

---

# 📊 Performance Results Summary

This performance testing engagement evaluated the FakeStore e-commerce API under **Baseline**, **Load**, and **Stress** scenarios. Three user journeys were tested using a realistic 70/20/10 traffic distribution. Across all tests, the system demonstrated **excellent stability**, **very low latency**, and **predictable scalability**.

---

## ✅ Baseline Test (≈30 Virtual Users)

- **p95 < 250 ms** across all samplers  
- **0% errors**  
- Stable throughput and response times

**Conclusion:** System healthy and ready for higher load.

---

## 🚀 Load Test (≈150 Virtual Users)

**Key Metrics:**

- **Total Samples:** ~54,470  
- **Error Rate:** **0.0018%** (1 failed request)  
- **Overall p95:** ~232 ms  
- **p99:** ~260 ms  
- **Throughput:** ~112.7 requests/sec  

### Endpoint-Level Highlights
- Browsing endpoints: **p95 ~200–250 ms**  
- Auth flows (`login`, `view cart`): **p95 ~260–310 ms**  
- Add-to-cart (`POST /carts`): **p95 ~170–230 ms**

**Conclusion:**  
Handled expected production load reliably and with room to spare.

---

## 🔥 Stress Test (300+ Virtual Users)

**Key Metrics:**

- **0% errors** across all endpoints  
- **Throughput:** ~206.6 requests/sec  
- **All p95 latencies remained < 350 ms**  
- No throughput collapse  
- No visible bottlenecks  
- All journeys remained stable under elevated load

**Conclusion:**  
System demonstrated excellent scalability and did **not reach a breaking point** within the tested range.

---

## 🧠 Overall System Behavior

| Attribute | Result |
|----------|--------|
| Error Rate | Near-zero across all tests |
| p95 Latency | Consistently < 350 ms for all journeys |
| Throughput | ~113 RPS (Load) → ~206 RPS (Stress) |
| Stability | No degradation or collapse |
| Bottlenecks | None encountered |
| Breaking Point | Not reached (300+ VUs) |

---

## 🧠 Performance Engineering Practices Used

- Workload modeling  
- Traffic distribution strategy  
- Percentile analysis (p90/p95/p99)  
- SLA and response code assertions  
- Correlation (JWT token extraction)  
- Dynamic JSON payload generation  
- Think-time simulation  
- CLI-based non-GUI execution  
- Reusable configuration elements & modular test plan design  

---

## 📌 Tech Stack

- **Apache JMeter 5.x**  
- **FakeStore REST API**  
- **CSV Data Config**  
- **JSON Extractor (Correlation)**  
- **Windows/Mac/Linux**  
- **JMeter CLI + HTML Dashboard Reporting**
