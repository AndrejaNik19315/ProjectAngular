export class Category {
    public name: string;
    public imagePath: string;
    public imageAlt: string;
    public link: string;

    constructor(name: string, imagePath: string, imageAlt: string, link: string){
        this.name = name;
        this.imagePath = imagePath;
        this.imageAlt = imageAlt;
        this.link = link;
    }
}