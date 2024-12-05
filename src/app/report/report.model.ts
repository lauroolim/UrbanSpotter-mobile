export class Report {
  id: number;
  title: string;
  description: string;
  location: string;
  created_at: Date;
  foto: string;
  user: string;

  constructor(
    id: number,
    title: string,
    description: string,
    location: string,
    created_at: Date,
    foto: string,
    user: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.location = location;
    this.created_at = created_at;
    this.foto = foto;
    this.user = user;
  }
}
