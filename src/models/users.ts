import * as db from '../helpers/database'

export const getAll = async() => {
    const query = "SELECT * FROM users"
    const data = await db.run_query(query, []);
    return data;
}

export const getById = async (id:number) => {
    const query = "SELECT * FROM users WHERE ID = ?"
    const values = [id]
    const data = await db.run_query(query, values);
    return data;
}

export const add = async (user:any) => {
    const keys = Object.keys(user); // keys = ['username', 'email', 'password']
    const values = Object.values(user); // values = ['sam', 'sam@gmail.com', 'P@ssw0rd']
    const key = keys.join(',');
    let param = '';
    for(let i:number = 0; i<values.length; i++){ param +='?,'};
    param = param.slice(0,-1);
    const query = `INSERT INTO users (${key}) VALUES (${param})`;
    try{
        await db.run_insert(query, values);
        return {status: 201};
    }catch(err:any){
        return err;
    }
}

export const update = async (id:number, user:any) => {
    let query = "UPDATE users SET ";
    const values: any = { id: id }; //{ id: 4, username: 'sam', email: 'sam@outlook.com'}
    const setClauses: string[] = [];
    Object.keys(user).forEach((key) => {
        setClauses.push(`${key} = :${key}`);
        values[key] = user[key];
      });
    
    query += setClauses.join(', ') + " WHERE id = :id;"; //UPDATE users SET username = :username, email = :email WHERE id = :id
    
    try{
        await db.run_update(query, values);
        return {status: 201};
    }catch(err:any){
        return err;
    }
}

export const del = async (id: number) => {
    const query = `DELETE FROM users WHERE id = :id;`;

    const values = {
        id: id
    };

    try{
        await db.run_delete(query, values);
        return {status: 201};
    }catch(err:any){
        return err;
    }
};

// username, password, email, ...
export const findByUsername = async (username:string) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    const user = await db.run_query(query, [username]);
    return user;
}