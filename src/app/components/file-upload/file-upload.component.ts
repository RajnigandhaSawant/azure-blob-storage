import { Component, OnInit } from '@angular/core';
import { BlobService, UploadConfig, UploadParams } from 'angular-azure-blob-service'
import { AzureBlobService } from 'src/app/servcies/azure-blob.service';
import { isArray } from 'util';


@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
    blobs: any[];
    existingBlob: any[];
    messages:string[];
    constructor(private blob: BlobService, private azureSvc: AzureBlobService) { }

    ngOnInit() {
        this.getBlobs();
    }

    save(img) {
        this.messages=[];
        var fctrl: HTMLInputElement = document.getElementById("image") as HTMLInputElement;
        debugger

        var filename;
        for (var i = 0; i < fctrl.files.length; i++) {
            filename="";
            for (var j=0;j<this.existingBlob.length;j++){
                if(this.existingBlob[j]!=undefined && this.existingBlob[j].Name==fctrl.files[i].name ){
                    filename = fctrl.files[i].name.split(".")[0]+ "(V)."+fctrl.files[i].name.split(".")[1];
                }
            }
            for (var j=0;j<this.existingBlob.length;j++){
                if(this.existingBlob[j]!=undefined && this.existingBlob[j].Name==filename ){
                    filename = filename.split(".")[0]+ "(V)."+filename.split(".")[1];
                }
            }
            if(filename=="")
                filename=fctrl.files[i].name;

            this.azureSvc.uploadBlob(fctrl.files[i], filename)
            .then(filename=>{
                this.messages.push("Uploading " + filename + " completed");
                this.getBlobs();
            },
            err=>{
                console.log(err);
            });
        }
    
    }

    getBlobs() {
        this.azureSvc.getBlobs()
            .subscribe(
                res => {
                    if( isArray(res.EnumerationResults.Blobs.Blob))
                        this.blobs = res.EnumerationResults.Blobs.Blob
                    else{
                        this.blobs=[];
                        this.blobs.push(res.EnumerationResults.Blobs.Blob)                        
                    }
                    this.existingBlob=this.blobs;
                },
                err => console.log(err)
            )
    }

    
}
