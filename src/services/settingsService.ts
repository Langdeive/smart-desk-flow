
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { logDeveloperAction } from "./developerAuditService";

export type SystemSettingKey = 
  | 'n8n_webhook_url' 
  | 'enable_ai_processing' 
  | 'events_to_n8n'
  | 'sla_config';

export interface SystemSetting<T = any> {
  id: string;
  company_id: string;
  key: SystemSettingKey;
  value: T;
  created_at: Date;
  updated_at: Date;
}

export interface N8nSettings {
  webhookUrl: string;
  enableProcessing: boolean;
  events: {
    ticketCreated: boolean;
    ticketUpdated: boolean;
    messageCreated: boolean;
    ticketAssigned: boolean;
  };
}

/**
 * Get a system setting by key
 */
export const getSystemSetting = async <T>(
  companyId: string, 
  key: SystemSettingKey
): Promise<T | null> => {
  const { data, error } = await supabase
    .from('system_settings')
    .select('value')
    .eq('company_id', companyId)
    .eq('key', key)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('Error fetching system setting:', error);
    }
    return null;
  }

  return data.value as T;
};

/**
 * Update a system setting with audit logging
 */
export const updateSystemSetting = async <T>(
  companyId: string,
  key: SystemSettingKey,
  value: T
): Promise<boolean> => {
  try {
    // Get current value for audit log
    const oldValue = await getSystemSetting(companyId, key);
    
    const { error } = await supabase
      .from('system_settings')
      .upsert(
        { company_id: companyId, key, value: value as unknown as Json },
        { onConflict: 'company_id,key' }
      );

    if (error) {
      console.error('Error updating system setting:', error);
      return false;
    }

    // Log the action for developers
    await logDeveloperAction({
      action: 'update_system_setting',
      resource_type: 'system_setting',
      resource_id: `${companyId}:${key}`,
      old_value: oldValue,
      new_value: value,
    });

    return true;
  } catch (error) {
    console.error('Error in updateSystemSetting:', error);
    return false;
  }
};

/**
 * Save or update a system setting with audit logging
 */
export const saveSystemSetting = async <T>(
  companyId: string,
  key: SystemSettingKey,
  value: T
): Promise<boolean> => {
  try {
    // Get current value for audit log
    const oldValue = await getSystemSetting(companyId, key);
    
    // Convert value to a JSON-compatible format that Supabase can handle
    const jsonValue = value as unknown as Json;
    
    const { error } = await supabase
      .from('system_settings')
      .upsert(
        { company_id: companyId, key, value: jsonValue },
        { onConflict: 'company_id,key' }
      );

    if (error) {
      console.error('Error saving system setting:', error);
      return false;
    }

    // Log the action for developers
    await logDeveloperAction({
      action: 'save_system_setting',
      resource_type: 'system_setting',
      resource_id: `${companyId}:${key}`,
      old_value: oldValue,
      new_value: value,
    });

    return true;
  } catch (error) {
    console.error('Error in saveSystemSetting:', error);
    return false;
  }
};

/**
 * Get N8n settings for a company
 */
export const getN8nSettings = async (companyId: string): Promise<N8nSettings> => {
  const defaultSettings: N8nSettings = {
    webhookUrl: "",
    enableProcessing: false,
    events: {
      ticketCreated: true,
      ticketUpdated: true,
      messageCreated: true,
      ticketAssigned: true,
    }
  };

  try {
    const webhookUrl = await getSystemSetting<string>(companyId, 'n8n_webhook_url') || "";
    const enableProcessing = await getSystemSetting<boolean>(companyId, 'enable_ai_processing') ?? false;
    const events = await getSystemSetting<N8nSettings['events']>(companyId, 'events_to_n8n') || defaultSettings.events;

    return {
      webhookUrl,
      enableProcessing,
      events
    };
  } catch (error) {
    console.error('Error fetching N8n settings:', error);
    return defaultSettings;
  }
};

/**
 * Save N8n settings for a company with audit logging
 */
export const saveN8nSettings = async (companyId: string, settings: N8nSettings): Promise<boolean> => {
  try {
    // Log the action first
    await logDeveloperAction({
      action: 'save_n8n_settings',
      resource_type: 'n8n_configuration',
      resource_id: companyId,
      new_value: settings,
    });

    const webhookResult = await saveSystemSetting(companyId, 'n8n_webhook_url', settings.webhookUrl);
    const processingResult = await saveSystemSetting(companyId, 'enable_ai_processing', settings.enableProcessing);
    const eventsResult = await saveSystemSetting(companyId, 'events_to_n8n', settings.events);

    return webhookResult && processingResult && eventsResult;
  } catch (error) {
    console.error('Error saving N8n settings:', error);
    return false;
  }
};
