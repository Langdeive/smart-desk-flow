
import { supabase } from "@/integrations/supabase/client";

export interface DeveloperAuditLog {
  id: string;
  developer_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_value?: any;
  new_value?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface CreateAuditLogParams {
  action: string;
  resource_type: string;
  resource_id?: string;
  old_value?: any;
  new_value?: any;
}

/**
 * Log an action performed by a developer
 */
export const logDeveloperAction = async (params: CreateAuditLogParams): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found for audit log');
      return false;
    }

    // Get client IP and user agent (limited in browser environment)
    const userAgent = navigator.userAgent;
    
    const { error } = await supabase
      .from('developer_audit_logs')
      .insert({
        developer_id: user.id,
        action: params.action,
        resource_type: params.resource_type,
        resource_id: params.resource_id,
        old_value: params.old_value,
        new_value: params.new_value,
        user_agent: userAgent,
      });

    if (error) {
      console.error('Error creating developer audit log:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in logDeveloperAction:', error);
    return false;
  }
};

/**
 * Get audit logs for the current developer
 */
export const getDeveloperAuditLogs = async (limit: number = 50): Promise<DeveloperAuditLog[]> => {
  try {
    const { data, error } = await supabase
      .from('developer_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching developer audit logs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDeveloperAuditLogs:', error);
    return [];
  }
};
