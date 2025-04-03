import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Notification } from '../models';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private socket: Socket;
  private apiUrl = `/notifications`;
  private socketUrl = 'http://localhost:5000';
  private userId: string = '';

  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: ApiService) {
    this.socket = io(this.socketUrl);
    this.setupSocketListeners();
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  private setupSocketListeners(): void {
    // 🔥 Authentification au WebSocket avec l'userId
    this.socket.emit('authenticate', this.userId);

    // 🔔 Écoute des nouvelles notifications
    this.socket.on('new_notification', (notification: Notification) => {
        console.log("Nouvelle notification reçue :", notification);
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = [notification, ...currentNotifications];
        this.notificationsSubject.next(updatedNotifications);
        this.updateUnreadCount();
    });

    // 🔔 Écoute des notifications lues
    this.socket.on('notification_read', (notificationId: string) => {
        const currentNotifications = this.notificationsSubject.value;
        const updatedNotifications = currentNotifications.map(notification =>
            notification._id === notificationId ? { ...notification, isRead: true } : notification
        );
        this.notificationsSubject.next(updatedNotifications);
        this.updateUnreadCount();
    });

    // 🔔 Écoute de l'événement "marquer toutes les notifications comme lues"
    this.socket.on('all_notifications_read', () => {
        const updatedNotifications = this.notificationsSubject.value.map(notification => ({
            ...notification,
            isRead: true
        }));
        this.notificationsSubject.next(updatedNotifications);
        this.updateUnreadCount();
    });

    // 🔔 Écoute des notifications supprimées
    this.socket.on('notification_deleted', (notificationId: string) => {
        const updatedNotifications = this.notificationsSubject.value.filter(notification => notification._id !== notificationId);
        this.notificationsSubject.next(updatedNotifications);
        this.updateUnreadCount();
    });
}


  // Initialise le service pour un utilisateur spécifique
  initForUser(userId: string): void {
    this.getNotifications(userId).subscribe(notifications => {
      this.notificationsSubject.next(notifications);
      this.updateUnreadCount();
      this.socket.emit('subscribe', { userId });
    });
  }

  // Obtient toutes les notifications pour un utilisateur
  getNotifications(userId: string): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}`);
  }

  // Crée une nouvelle notification
  createNotification(notification: Partial<Notification>): Observable<Notification> {
    return this.http.post<Notification>(this.apiUrl, notification);
  }

  // Marque une notification comme lue
  markAsRead(notificationId: string): Observable<Notification> {
    return this.http.put<Notification>(`${this.apiUrl}/${notificationId}/read`, {});
  }

  // Marque toutes les notifications d'un utilisateur comme lues
  markAllAsRead(userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${userId}/read-all`, {});
  }

  // Supprime une notification
  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${notificationId}`);
  }

  // Met à jour le compteur de notifications non lues
  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(
      notification => notification && !notification.isRead
    ).length;

    console.log("Total des notifications non lues :", unreadCount); // 🔥 Affiche le compteur
    this.unreadCountSubject.next(unreadCount);
}

  // Nettoyage lors de la déconnexion
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  authenticate(userId: string): void {
    this.socket.emit('authenticate', userId);
  }

}
