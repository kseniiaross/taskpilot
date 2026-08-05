export const isValidEmail=(
  email:string,
)=>{

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

};


export const isValidPassword=(
  password:string,
)=>{

  return password.length>=8;

};


export const isRequired=(
  value:string,
)=>{

  return value.trim().length>0;

};