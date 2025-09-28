# Issue #018: Asynchronous Simulation Processing with Job Queue

## Description
Convert the simulation processing from synchronous to asynchronous using a job queue system to handle potentially long-running calculations and improve scalability.

## Acceptance Criteria
- [ ] Implement job queue system (BullMQ or similar)
- [ ] Convert simulation endpoint to return job ID immediately
- [ ] Create worker process for simulation processing
- [ ] Implement job status polling endpoint
- [ ] Add job progress tracking and updates
- [ ] Create job failure handling and retry logic
- [ ] Implement job result storage and retrieval

## Technical Requirements
- **Job Queue**: BullMQ with Redis backend
- **Worker Process**: Separate worker for simulation processing
- **Progress Tracking**: Real-time job progress updates
- **Error Handling**: Retry logic and failure recovery
- **Result Storage**: Persistent job results
- **Monitoring**: Job queue monitoring and metrics

## Implementation Details

### Job Queue Setup
```typescript
// simulation.queue.ts
import { Queue, Worker } from "bullmq";

export const simulationQueue = new Queue("simulation", {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
});

export const simulationWorker = new Worker(
  "simulation",
  async (job) => {
    const { simulationId, inputs, regionId } = job.data;

    // Update job progress
    await job.updateProgress(10);

    // Perform simulation calculations
    const results = await calculateSimulationResults(inputs, regionId);

    await job.updateProgress(90);

    // Save results to database
    await saveSimulationResults(simulationId, results);

    await job.updateProgress(100);

    return results;
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    },
  }
);
```

### API Endpoints
```typescript
// POST /api/v1/simulations
@Post()
async createSimulation(@Body() createSimulationDto: CreateSimulationDto) {
  const simulation = await this.simulationService.create(createSimulationDto);
  
  const job = await simulationQueue.add("process-simulation", {
    simulationId: simulation.id,
    inputs: createSimulationDto.inputs,
    regionId: createSimulationDto.regionId,
  });

  return {
    runId: job.id,
    status: "PENDING",
    message: "Simulation queued for processing",
  };
}

// GET /api/v1/simulations/{runId}
@Get(":runId")
async getSimulationStatus(@Param("runId") runId: string) {
  const job = await simulationQueue.getJob(runId);

  if (!job) {
    throw new NotFoundException("Simulation not found");
  }

  const state = await job.getState();

  return {
    runId,
    status: state,
    progress: job.progress,
    result: job.returnvalue,
    error: job.failedReason,
  };
}
```

### Frontend Integration
```typescript
// Simulation polling hook
export const useSimulationStatus = (runId: string) => {
  const [status, setStatus] = useState("PENDING");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!runId) return;

    const pollStatus = async () => {
      try {
        const response = await api.get(`/simulations/${runId}`);
        setStatus(response.data.status);
        setProgress(response.data.progress);

        if (response.data.result) {
          setResult(response.data.result);
        } else if (response.data.status === "PENDING") {
          setTimeout(pollStatus, 2000); // Poll every 2 seconds
        }
      } catch (error) {
        console.error("Error polling simulation status:", error);
      }
    };

    pollStatus();
  }, [runId]);

  return { status, progress, result };
};
```

## Job Queue Benefits
- **Scalability**: Handle multiple simulations concurrently
- **Reliability**: Job persistence and failure recovery
- **Progress Tracking**: Real-time progress updates
- **Resource Management**: Control concurrent job execution
- **Monitoring**: Job queue metrics and monitoring

## Error Handling
- **Job Retry**: Automatic retry for failed jobs
- **Dead Letter Queue**: Handle permanently failed jobs
- **Error Logging**: Comprehensive error logging and monitoring
- **User Notification**: Notify users of job failures

## Definition of Done
- [ ] Job queue system is implemented and working
- [ ] Simulation endpoint returns job ID immediately
- [ ] Worker process processes simulations correctly
- [ ] Job status polling works reliably
- [ ] Progress tracking provides real-time updates
- [ ] Error handling and retry logic work properly
- [ ] Job results are stored and retrievable

## Priority: High
## Estimated Effort: 8-10 hours
## Labels: backend, async, job-queue
