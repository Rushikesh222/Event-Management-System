class AdvancedQueue {
  constructor(concurrency = 2) {
    this.queue = [];
    this.running = 0;
    this.concurrency = concurrency;
    this.jobId = 0;
  }

  add(jobFn, options = {}) {
    const job = {
      id: ++this.jobId,
      fn: jobFn,
      retries: options.retries || 2,
      delay: options.delay || 0,
      status: "pending"
    };

    if (job.delay > 0) {
      setTimeout(() => {
        this.queue.push(job);
        this.process();
      }, job.delay);
    } else {
      this.queue.push(job);
      this.process();
    }

    return job.id;
  }

  async process() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const job = this.queue.shift();
      this.running++;

      this.execute(job);
    }
  }

  async execute(job) {
    job.status = "processing";

    try {
      await job.fn();
      job.status = "completed";
      console.log(`✅ Job ${job.id} completed`);
    } catch (err) {
      console.log(`❌ Job ${job.id} failed: ${err.message}`);

      if (job.retries > 0) {
        job.retries--;
        job.status = "retrying";
        console.log(`🔁 Retrying job ${job.id}...`);

        this.queue.push(job);
      } else {
        job.status = "failed";
      }
    }

    this.running--;
    this.process();
  }
}

module.exports = new AdvancedQueue(3); // 3 parallel jobs