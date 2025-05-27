
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
  company_id: string | null;
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
 * Get a system setting by key with fallback to global configuration
 */
export const getSystemSetting = async <T>(
  companyId: string, 
  key: SystemSettingKey
): Promise<T | null> => {
  try {
    // First, try to get company-specific setting
    const { data: companySetting, error: companyError } = await supabase
      .from('system_settings')
      .select('value')
      .eq('company_id', companyId)
      .eq('key', key)
      .maybeSingle();

    if (companyError && companyError.code !== 'PGRST116') {
      console.error('Error fetching company setting:', companyError);
    }

    if (companySetting) {
      return companySetting.value as T;
    }

    // If no company setting found, try global setting
    const { data: globalSetting, error: globalError } = await supabase
      .from('system_settings')
      .select('value')
      .is('company_id', null)
      .eq('key', key)
      .maybeSingle();

    if (globalError && globalError.code !== 'PGRST116') {
      console.error('Error fetching global setting:', globalError);
    }

    return globalSetting ? globalSetting.value as T : null;
  } catch (error) {
    console.error('Error in getSystemSetting:', error);
    return null;
  }
};

/**
 * Get a global system setting (company_id = null)
 */
export const getGlobalSystemSetting = async <T>(
  key: SystemSettingKey
): Promise<T | null> => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .is('company_id', null)
      .eq('key', key)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching global setting:', error);
      return null;
    }

    return data ? data.value as T : null;
  } catch (error) {
    console.error('Error in getGlobalSystemSetting:', error);
    return null;
  }
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
 * Save or update a global system setting with audit logging
 */
export const saveGlobalSystemSetting = async <T>(
  key: SystemSettingKey,
  value: T
): Promise<boolean> => {
  try {
    const oldValue = await getGlobalSystemSetting(key);
    
    const { error } = await supabase
      .from('system_settings')
      .upsert(
        { company_id: null, key, value: value as unknown as Json },
        { onConflict: 'company_id,key' }
      );

    if (error) {
      console.error('Error saving global system setting:', error);
      return false;
    }

    await logDeveloperAction({
      action: 'save_global_system_setting',
      resource_type: 'global_system_setting',
      resource_id: `global:${key}`,
      old_value: oldValue,
      new_value: value,
    });

    return true;
  } catch (error) {
    console.error('Error in saveGlobalSystemSetting:', error);
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
    const oldValue = await getSystemSetting(companyId, key);
    
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
 * Get N8n settings for a company with global fallback
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
 * Get global N8n settings
 */
export const getGlobalN8nSettings = async (): Promise<N8nSettings> => {
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
    const webhookUrl = await getGlobalSystemSetting<string>('n8n_webhook_url') || "";
    const enableProcessing = await getGlobalSystemSetting<boolean>('enable_ai_processing') ?? false;
    const events = await getGlobalSystemSetting<N8nSettings['events']>('events_to_n8n') || defaultSettings.events;

    return {
      webhookUrl,
      enableProcessing,
      events
    };
  } catch (error) {
    console.error('Error fetching global N8n settings:', error);
    return defaultSettings;
  }
};

/**
 * Save N8n settings for a company with audit logging
 */
export const saveN8nSettings = async (companyId: string, settings: N8nSettings): Promise<boolean> => {
  try {
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

/**
 * Save global N8n settings with audit logging
 */
export const saveGlobalN8nSettings = async (settings: N8nSettings): Promise<boolean> => {
  try {
    await logDeveloperAction({
      action: 'save_global_n8n_settings',
      resource_type: 'global_n8n_configuration',
      resource_id: 'global',
      new_value: settings,
    });

    const webhookResult = await saveGlobalSystemSetting('n8n_webhook_url', settings.webhookUrl);
    const processingResult = await saveGlobalSystemSetting('enable_ai_processing', settings.enableProcessing);
    const eventsResult = await saveGlobalSystemSetting('events_to_n8n', settings.events);

    return webhookResult && processingResult && eventsResult;
  } catch (error) {
    console.error('Error saving global N8n settings:', error);
    return false;
  }
};

/**
 * Check which configuration source is being used
 */
export const getConfigurationSource = async (
  companyId: string,
  key: SystemSettingKey
): Promise<'company' | 'global' | 'none'> => {
  try {
    const { data: companySetting } = await supabase
      .from('system_settings')
      .select('value')
      .eq('company_id', companyId)
      .eq('key', key)
      .maybeSingle();

    if (companySetting) {
      return 'company';
    }

    const { data: globalSetting } = await supabase
      .from('system_settings')
      .select('value')
      .is('company_id', null)
      .eq('key', key)
      .maybeSingle();

    return globalSetting ? 'global' : 'none';
  } catch (error) {
    console.error('Error checking configuration source:', error);
    return 'none';
  }
};
