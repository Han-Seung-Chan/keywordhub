import { delay } from "@/utils/delete";

interface QueueItem<T> {
  requestFn: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: Error | unknown) => void;
}

export class RequestQueue {
  private queue: QueueItem<unknown>[] = [];
  private processing: boolean = false;
  private interval: number;

  /**
   * @param requestsPerMinute 분당 최대 요청 수
   */
  constructor(requestsPerMinute: number = 60) {
    this.interval = Math.ceil(60000 / requestsPerMinute); // 분당 요청 수에 따른 간격 계산
  }

  /**
   * 큐에 요청 추가
   * @param requestFn 실행할 요청 함수
   */
  enqueue<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        requestFn,
        resolve,
        reject,
      });

      // 큐가 처리 중이 아니면 처리 시작
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  /**
   * 큐 처리
   */
  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const { requestFn, resolve, reject } = this.queue.shift()!;

    try {
      // 요청 실행
      const result = await requestFn();
      resolve(result);
    } catch (error) {
      reject(error);
    }

    // 다음 요청 전 지정된 간격만큼 대기
    await delay(this.interval);
    this.processQueue();
  }
}
