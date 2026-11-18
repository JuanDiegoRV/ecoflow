/**
 * Tipos manuales derivados de la migración SQL 20261118120000_initial_schema.
 * No fueron generados desde una instancia Supabase conectada.
 * Generación oficial futura:
 * npx supabase gen types typescript --local > src/types/database.generated.ts
 */
export type Role = 'admin' | 'installer'
export type ProjectStatus = 'pending' | 'in_progress' | 'completed'
export type MaterialUnit = 'unit' | 'meter' | 'kilogram' | 'liter' | 'box'

export interface Database {
  public: {
    Tables: {
      organizaciones: { Row: Organization; Insert: OrganizationInsert; Update: OrganizationUpdate; Relationships: [] }
      perfiles: { Row: Profile; Insert: ProfileInsert; Update: ProfileUpdate; Relationships: [] }
      instaladores: { Row: Installer; Insert: InstallerInsert; Update: InstallerUpdate; Relationships: [] }
      proyectos: { Row: Project; Insert: ProjectInsert; Update: ProjectUpdate; Relationships: [] }
      proyecto_instaladores: { Row: ProjectInstaller; Insert: ProjectInstallerInsert; Update: never; Relationships: [] }
      materiales: { Row: Material; Insert: MaterialInsert; Update: MaterialUpdate; Relationships: [] }
      proyecto_materiales: { Row: ProjectMaterial; Insert: ProjectMaterialInsert; Update: ProjectMaterialUpdate; Relationships: [] }
    }
    Enums: { role: Role; project_status: ProjectStatus; material_unit: MaterialUnit }
  }
}

export interface Organization { id: string; nombre: string; slug: string; created_at: string; updated_at: string }
export type OrganizationInsert = Pick<Organization, 'nombre' | 'slug'> & Partial<Pick<Organization, 'id' | 'created_at' | 'updated_at'>>
export type OrganizationUpdate = Partial<OrganizationInsert>
export interface Profile { id: string; organizacion_id: string; rol: Role; nombre_completo: string; created_at: string; updated_at: string }
export type ProfileInsert = Pick<Profile, 'id' | 'organizacion_id' | 'nombre_completo'> & Partial<Pick<Profile, 'rol' | 'created_at' | 'updated_at'>>
export type ProfileUpdate = Partial<Pick<Profile, 'nombre_completo' | 'updated_at'>>
export interface Installer { id: string; perfil_id: string; telefono: string | null; activo: boolean; created_at: string; updated_at: string }
export type InstallerInsert = Pick<Installer, 'perfil_id'> & Partial<Omit<Installer, 'id' | 'perfil_id' | 'created_at' | 'updated_at'>>
export type InstallerUpdate = Partial<Pick<Installer, 'telefono' | 'activo' | 'updated_at'>>
export interface Project { id: string; organizacion_id: string; nombre: string; cliente_nombre: string; direccion: string; potencia_kw: number; estado: ProjectStatus; fecha_planificada: string | null; notas: string | null; creado_por: string; created_at: string; updated_at: string }
export type ProjectInsert = Pick<Project, 'organizacion_id' | 'nombre' | 'cliente_nombre' | 'direccion' | 'potencia_kw' | 'creado_por'> & Partial<Pick<Project, 'id' | 'estado' | 'fecha_planificada' | 'notas' | 'created_at' | 'updated_at'>>
export type ProjectUpdate = Partial<Pick<Project, 'nombre' | 'cliente_nombre' | 'direccion' | 'potencia_kw' | 'estado' | 'fecha_planificada' | 'notas' | 'updated_at'>>
export interface ProjectInstaller { proyecto_id: string; instalador_id: string; asignado_por: string; asignado_en: string }
export type ProjectInstallerInsert = Pick<ProjectInstaller, 'proyecto_id' | 'instalador_id' | 'asignado_por'> & Partial<Pick<ProjectInstaller, 'asignado_en'>>
export interface Material { id: string; organizacion_id: string; nombre: string; unidad: MaterialUnit; activo: boolean; created_at: string; updated_at: string }
export type MaterialInsert = Pick<Material, 'organizacion_id' | 'nombre' | 'unidad'> & Partial<Pick<Material, 'id' | 'activo' | 'created_at' | 'updated_at'>>
export type MaterialUpdate = Partial<Pick<Material, 'nombre' | 'unidad' | 'activo' | 'updated_at'>>
export interface ProjectMaterial { proyecto_id: string; material_id: string; cantidad: number; registrado_por: string; created_at: string; updated_at: string }
export type ProjectMaterialInsert = Pick<ProjectMaterial, 'proyecto_id' | 'material_id' | 'cantidad' | 'registrado_por'> & Partial<Pick<ProjectMaterial, 'created_at' | 'updated_at'>>
export type ProjectMaterialUpdate = Partial<Pick<ProjectMaterial, 'cantidad' | 'updated_at'>>
