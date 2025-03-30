// interfaces/IUser.interfaces.ts
export interface User {
    id: number;
    type_document_id: number;
    name_type_document_id: string;
    document_number: string;
    name: string;
    user_type_id: number;
    email: string;
    name_user_type: string;
  }
  
  export interface UserResponse {
    data: User[];
    hasMore: boolean;
    totalCount: number;
    success: boolean;
    message?: string;
  }