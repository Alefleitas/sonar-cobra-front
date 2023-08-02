import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogInfoComponent } from "src/app/components/dialog-info/dialog-info.component";
import { AppConfig } from "src/app/models/app-config";

@Injectable({
    providedIn: 'root'
  })
export class AppConfigService {
    private config: AppConfig;
    loaded = false;
    version = Math.random().toString(36).slice(2, 15);

    constructor(
        private http: HttpClient,
        public dialog: MatDialog
    ){}

    loadConfig(): Promise<void>{
        return this.http.get<AppConfig>(`/assets/app.config.json?v=${this.version}`)
                        .toPromise()
                        .then(data => {

                            this.config = data;
                            this.loaded = true;
                        })
    }

    getConfig(): AppConfig {
        return this.config;
    }

    showAnnouncements(section: string){
        const AnnouncementsToShow = this.config.anuncios[section].filter(x => x.enabled);
        this.openAnnouncementDialogInfo(AnnouncementsToShow, 0)
    }

    // Para mostrar recursivamente (y no simultáneamente) los dialog
    private openAnnouncementDialogInfo(announcements: any[], idx: number): void {
        if (idx >= announcements.length) return;
        const announcement = announcements[idx];

        const dialog = this.dialog.open(DialogInfoComponent, {
          maxWidth: announcement.size === "lg" ? "600px" : announcement.size === "md" ? "450px" : "300px",
          panelClass: 'dialog-responsive',
          data: {text: announcement.message, icon: announcement.icon}
        });

        const sub = dialog.afterClosed()
            .subscribe((data) => {
            sub.unsubscribe();
            this.openAnnouncementDialogInfo(announcements, idx + 1);
            });
    }

}
