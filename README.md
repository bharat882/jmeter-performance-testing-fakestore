# 🧪 Apache JMeter Performance Testing – FakeStore E-Commerce API  
**Complete end-to-end performance test suite with baseline, load, and stress testing**

This project is a full performance testing framework designed to simulate realistic user behavior on an e-commerce–style API using **Apache JMeter**. It includes multi-journey scenarios, dynamic data injection, JWT token correlation, SLA assertions, and non-GUI execution with HTML reporting — similar to how enterprise performance engineering teams operate.

---

## 🚀 **Project Highlights**

- Designed **three end-to-end user journeys**:
  - 🛒 **Anonymous Browsing** (products list, product details, categories)  
  - 🔐 **Login + View Cart** (JWT-based correlation)  
  - ➕ **Add to Cart** (POST requests with dynamic JSON payloads)
- Built a **realistic workload model** using a 70/20/10 traffic split.
- Implemented **CSV-driven dynamic test data** (`cart_data.csv`) for cart creation.
- Added **JWT token extraction** via JSON Extractor for authenticated flows.
- Implemented **SLA assertions** for Response Code & Response Time (p95 targets).
- Used **Timers (think-time)** to simulate real user behavior.
- Executed **Baseline**, **Load (150 VUs)**, and **Stress (up to 300 VUs)** in **non-GUI mode**.
- Generated **JMeter HTML Dashboards** with percentile charts, throughput, and error trends.
- Project is **fully CI-ready** using command-line JMeter execution.

---

## 📐 **Architecture & Folder Structure**

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

> The HTML dashboards are not included directly — only screenshots for readability.

---

## 🔥 **User Journeys**

### **Journey 1: Anonymous Browsing**
Endpoints:
- `GET /products?limit=20`
- `GET /products/{id}`
- `GET /products/categories`

### **Journey 2: Login + View Cart**
- `POST /auth/login`
- Extract JWT token via JSONPath (`$.token`)
- `GET /carts/user/{id}` with `Authorization: Bearer ${authToken}`

### **Journey 3: Add to Cart (Dynamic)**
- CSV-driven products, quantities, dates
- `POST /carts` with dynamic JSON body

---

## 🎛 **Load Profiles**

### **Baseline Test**  
- VUs: **30 total**  
- Duration: **5 min**  
- Goal: Confirm stability under small load

### **Load Test**  
- VUs: **150 total**  
- Duration: **8 min steady state**  
- Output: HTML dashboard with p90/p95 percentiles

### **Stress Test**  
- VUs ramped to **300+ total**  
- Goal: Find breaking point / performance degradation  
- Output: latency curve, throughput collapse, error % patterns

---

## 🧵 **Non-GUI Execution (Command Line)**

```bash
jmeter -n -t test-plans/FakeStoreAPI_Perf_LoadTest.jmx        -l loadtest_results.jtl        -e -o reports/loadtest
```

---

**## 📊 Load Test (Approx. 150 Virtual Users)

- Total samples: ~54,470  
- Overall error rate: **0.0018%** (1 failed request)  
- Overall p95: **~232 ms**, p99: **~260 ms**  
- Throughput: **~112.7 requests/sec**

**Endpoint highlights:**
- Browsing (`/products`, `/products/{id}`, `/products/categories`) maintained p95 under **~200–250 ms**.
- Auth flows (`/auth/login`, `/carts/user/{id}`) maintained p95 under **~260–310 ms**.
- Write operation (`POST /carts`) stayed performant with p95 under **~170–230 ms**.
**

---

## 🧠 **Performance Engineering Practices Used**

- Workload modeling  
- Traffic distribution modeling  
- Percentile analysis (p90/p95/p99)  
- SLA enforcement via assertions  
- Correlation (JWT token extraction)  
- Dynamic request payloads  
- Think-time simulation  
- CLI-based execution for CI/CD pipelines  
- Structured test plans with reusable config elements  

---

## 📌 **Tech Stack**

- **Apache JMeter 5.x**
- **REST APIs (FakeStore API)**
- **CSV Data Config**
- **JSON Extractor (Correlation)**
- **Non-GUI CLI execution**
- **HTML Dashboard Reporting**
- **Windows/Mac/Linux compatible**
