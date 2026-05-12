# Code Review: SimpleCache (Kotlin)

## Overview
This document reviews issues in a SimpleCache implementation intended for a highly concurrent environment (thousands of reads/sec, hundreds of writes/sec, tens of threads).

---

## 1. TTL is not enforced (no cleanup mechanism)

### Issue
Expired entries are only checked during `get()` but never removed from the cache.

```kotlin
if (System.currentTimeMillis() - entry.timestamp < ttlMs)
```

### Impact
- Memory grows indefinitely
- Stale entries accumulate
- Potential memory leak in long-running services

---

## 2. Incorrect cache size semantics

### Issue
```kotlin
fun size(): Int = cache.size
```

This includes expired entries.

### Impact
- Misleading monitoring metrics
- Incorrect autoscaling signals
- Debugging confusion

---

## 3. Race condition between retrieval and expiration check

### Issue
Time-of-check vs time-of-use inconsistency:

```kotlin
val entry = cache[key]
```

### Impact
- Rare stale reads under concurrency
- Non-deterministic behavior

---

## 4. No cleanup strategy

### Issue
No eviction mechanism (background or lazy cleanup).

### Impact
- Unbounded memory usage
- Increased GC pressure
- Latency degradation over time

---

## 5. Use of System.currentTimeMillis()

### Issue
Wall-clock time is used for TTL.

### Better alternative
Use monotonic time:
```kotlin
System.nanoTime()
```

### Impact
- TTL may break due to system clock changes
- Incorrect expiration behavior

---

## 6. Inefficient read path

### Issue
Every `get()` calls:
```kotlin
System.currentTimeMillis()
```

### Impact
- CPU overhead under heavy read load
- Reduced cache efficiency

---

## 7. No atomic expiration + removal

### Issue
Expired entries are never removed from map.

### Impact
- Stale data remains in memory
- Repeated cache misses still retain garbage

---

## 8. Partial thread safety misunderstanding

### Issue
ConcurrentHashMap is thread-safe, but logic is not atomic:

```kotlin
val entry = cache[key]
if (valid) return value
```

### Impact
- Inconsistent reads under concurrent writes

---

## 9. No eviction policy

### Issue
No:
- max size limit
- LRU/LFU policy

### Impact
- Memory exhaustion risk
- Uncontrolled growth in high-cardinality workloads

---

## 10. Missing write optimization strategy

### Issue
All writes directly hit ConcurrentHashMap.

### Impact
- Internal contention under write bursts
- Reduced throughput scalability

---

## Summary

### Key risks:
- Memory leaks due to missing cleanup
- Incorrect metrics
- Weak TTL enforcement
- Suboptimal concurrency design

### Recommendation:
Consider using a production-grade cache like:
- Caffeine (preferred in JVM ecosystems)

or implement:
- background eviction thread
- monotonic time-based TTL
- bounded cache size with eviction policy
