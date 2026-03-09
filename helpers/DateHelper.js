export class DateHelper {
    static formatDate(dateString) {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("sv-SE").format(date);
    }
  }