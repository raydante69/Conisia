import React from 'react';

// Firebase Types
export interface FirebaseUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: string;
}

export interface FirebaseDocument {
  id: string;
  name: string;
  type: string;
  tags: string[];
  aiDescription?: string;
  content?: string;
  ownerId: string;
  createdAt: string;
}

export interface FirebaseGroup {
  id: string;
  name: string;
  members: string[];
  ownerId: string;
  createdAt: string;
}

export interface FirebaseRequest {
  id: string;
  title: string;
  description: string;
  department?: string;
  status: 'pending' | 'in-progress' | 'completed';
  senderId: string;
  recipientIds: string[];
  createdAt: string;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export enum ChatRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

// Added new view states
export type ViewState = 
  | 'landing' 
  | 'dashboard' 
  | 'documents' 
  | 'groups' 
  | 'group-chat'
  | 'directory' 
  | 'calendar' 
  | 'ai-search' 
  | 'requests'
  | 'my-tasks'
  | 'hr-view'
  | 'stats-view'; // Added stats-view

export type LandingView = 'HOME' | 'FEATURES' | 'AI' | 'GROUPS';

export const DEPARTMENTS = [
  'MARKETING',
  'PRODUCT_AND_TECH',
  'OPERATIONS',
  'STAFF',
  'STRATEGIC_ACCOUNTS',
  'FINANCE'
] as const;

export type Department = typeof DEPARTMENTS[number];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  department: Department;
  avatar: string;
  onboardingCompleted: boolean;
  skills?: string[];        // New field
  currentProjects?: string[]; // New field
}

export interface DocumentPermission {
    userId?: string;
    groupId?: string; // Can be a Department
    access: 'READ' | 'EDIT';
}

export interface DocumentVersion {
  id: string;
  version: string;
  date: string;
  author: string;
  changes: string;
  url: string; // In real app, would be different URLs
}

export interface AppDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  uploader: string;
  department: Department;
  url?: string;
  tags: string[];
  permissions: DocumentPermission[];
  versions: DocumentVersion[];
  aiDescription?: string; // New field for AI analysis
  isPinned?: boolean;     // New field for pinning
}

export interface Notification {
  id: string;
  userId: string; // The recipient
  title: string;
  message: string;
  type: 'SHARE' | 'EDIT' | 'SYSTEM';
  read: boolean;
  date: string;
}

export type RequestStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface RequestStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  department: Department;
  assignedTo: string; // Name of person
  createdBy: string; // NEW: To distinguish my requests vs assigned tasks
  status: RequestStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  steps: RequestStep[]; // AI Generated steps
  createdAt: string;
}

// Group Chat Types
export interface MessageAttachment {
  url: string;
  name: string;
  type: string;
  size: string;
}

export interface GroupMessage {
    id: string;
    groupId: string;
    senderId: string;
    text: string;
    timestamp: string;
    attachment?: MessageAttachment;
}

export interface DirectMessage {
    id: string;
    conversationId: string; // e.g., "user1Id_user2Id" sorted alphabetically
    senderId: string;
    text: string;
    timestamp: string;
    attachment?: MessageAttachment;
}

export interface Group {
    id: string;
    name: string;
    members: string[];
    ownerId: string;
    bg: string;
    description: string;
}