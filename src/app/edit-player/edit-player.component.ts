import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {
  profilePictures = ['1.webp', '2.png', '3.png', '4.png']

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) { }

}
