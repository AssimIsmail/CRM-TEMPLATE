export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  profile?: File |string;
  centreId?: number;
  created_at?: Date;
  updated_at?: Date;
  token?: string;
}


// export interface RegisterUser {
//         first_name: string;  // Use lowercase 'string'
//         last_name: string;   // Use lowercase 'string'
//         email: string;       // Use lowercase 'string'
//         phone: string;       // Use lowercase 'string'
//         password: string;    // Use lowercase 'string'
//         role?: string;       // Make role optional
//         profile?: File; 
//         centreId?: number;// Make centreId optional
//         // Add this line
//       }
  

// export interface Password {
//   password: string;
// }
// ;
