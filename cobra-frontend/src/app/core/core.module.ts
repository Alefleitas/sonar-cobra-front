import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './interceptors';
import { AuthService } from './auth/auth.service';
import { EnumToArrayPipe } from './pipes/enum-to-array.pipe';
import { CamelCaseToSentenceCasePipe } from './pipes/camel-case-to-sentence-case.pipe';



@NgModule({
    imports: [HttpClientModule],
    providers: [
        httpInterceptorProviders
    ],
    declarations: [EnumToArrayPipe, CamelCaseToSentenceCasePipe],
    exports: [
        EnumToArrayPipe,
        CamelCaseToSentenceCasePipe
    ]
})
export class CoreModule { }

