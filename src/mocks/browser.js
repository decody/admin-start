import { setupWorker } from "msw/browser";
import { handlers } from "./handler";

// 브라우저용 MSW 서비스 워커 설정
export const worker = setupWorker(...handlers);
