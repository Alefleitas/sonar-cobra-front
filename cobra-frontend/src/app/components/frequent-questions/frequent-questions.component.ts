import { Component, OnInit } from '@angular/core';
import { AppConfigService } from 'src/app/core/config/AppConfigService';

@Component({
  selector: 'app-frequent-questions',
  templateUrl: './frequent-questions.component.html',
  styleUrls: ['./frequent-questions.component.scss']
})
export class FrequentQuestionsComponent implements OnInit {

  questionAnswers: any[];

  constructor(private appConfigService: AppConfigService) { }

  ngOnInit(): void {
    this.questionAnswers = this.appConfigService.getConfig().preguntasFrecuentes;
  }

}