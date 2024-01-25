import { Component } from '@angular/core';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

    kindergarten = {
        name: 'Placeholder Kindergarten Name',
        imageUrl: 'path-to-image.jpg',
        description: 'Description of the Kindergarten...',
        facilities: ['Playground', 'Library', 'Cafeteria'],
        address: '123 Kindergarten Street, City, Country',
        phone: '123-456-7890',
        email: 'contact@kindergarten.com'
      };

}
