export interface Centre {
    id:number;
    name :string;
    location  :string;
    phone  :string;
    email  :string;
    logo  :string;
}
export interface CentreAdd {
    name :string;
    location  :string;
    phone  :string;
    email  :string;
    logo?: File; 
  }
