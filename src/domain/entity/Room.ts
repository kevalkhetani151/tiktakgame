
export enum RoomType {
    public = 'public',
    private = 'private',
  }

  
  
  export interface Room {
    id: number;
    name: string;
    type: RoomType;
    Key?: string;
    status: string;
    createdById: number;
    createdAt: Date;
    updatedAt: Date;
  }
  