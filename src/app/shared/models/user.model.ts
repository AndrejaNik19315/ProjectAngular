export class User {
    public uid?: string;
    public displayName?: string;
    public email?: string;
    public photoURL?: string;

    constructor(uid: string, displayName: string, email: string, photoURL: string){
        this.uid = uid;
        this.displayName = displayName;
        this.email = email;
        this.photoURL = photoURL;
    }
}