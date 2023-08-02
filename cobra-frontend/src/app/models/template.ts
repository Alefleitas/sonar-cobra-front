export class Template {
    id: number;
    description: string;
    subject: string;
    htmlBody: string;
    disabled: boolean;
}

export class NotificationType {
    id: number;
    template: Template;
    description: string;
}