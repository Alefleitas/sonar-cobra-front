import { PublishDebtRejection } from "./publish-debt-rejection.model";

export class DebtRejection {

    id: number;
    fileName: string;
    fileDate: string;
    publishDebtRejections: PublishDebtRejection[];
}
