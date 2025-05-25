export class Appointment {
    constructor(
      public id: string,
      public userId: string,
      public date: Date,
      public service: string
    ) {}
  }
  