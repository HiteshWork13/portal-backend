export type adminRoles = 1 | 2 | 3

export interface AdminLogin {
    email: String,
    password: String
}

export type adminStaus = 1 | 0

export interface NewAdminUser {
    username: String
    email: String
    password: String
    status?: adminStaus
    role: adminRoles
    created_by?: String
}

export interface NewSuperAdminUser {
    username: String
    email: String
    password: String
    status?: adminStaus
    role: adminRoles
    created_by?: String,
    admin_secret: String
}

export interface UpdateAdminUser {
    username: String
}

export interface AdminUser {
    id?: String
    username?: String
    email?: String
    password?: String
    status?: adminStaus
    role?: adminRoles
    created_by?: String
    created_at?: String
    updated_at?: String
}