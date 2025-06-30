
import React, { useState, useCallback, useRef } from 'react';
import { SecureLogger } from '@/utils/secureLogger';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitState {
  attempts: number;
  firstAttempt: number;
  isBlocked: boolean;
  blockUntil?: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutos
  blockDurationMs: 30 * 60 * 1000 // 30 minutos de bloqueio
};

export function useRateLimiter(
  key: string,
  config: Partial<RateLimitConfig> = {}
) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const stateRef = useRef<Map<string, RateLimitState>>(new Map());
  
  const [isBlocked, setIsBlocked] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(finalConfig.maxAttempts);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  const updateState = useCallback(() => {
    const now = Date.now();
    const state = stateRef.current.get(key);
    
    if (!state) {
      setIsBlocked(false);
      setAttemptsRemaining(finalConfig.maxAttempts);
      setBlockTimeRemaining(0);
      return;
    }

    // Verificar se o bloqueio expirou
    if (state.isBlocked && state.blockUntil && now > state.blockUntil) {
      stateRef.current.delete(key);
      setIsBlocked(false);
      setAttemptsRemaining(finalConfig.maxAttempts);
      setBlockTimeRemaining(0);
      SecureLogger.info(`Rate limit block expired for key: ${key}`);
      return;
    }

    // Verificar se a janela de tempo expirou
    if (now - state.firstAttempt > finalConfig.windowMs) {
      stateRef.current.delete(key);
      setIsBlocked(false);
      setAttemptsRemaining(finalConfig.maxAttempts);
      setBlockTimeRemaining(0);
      return;
    }

    // Atualizar estados
    setIsBlocked(state.isBlocked);
    setAttemptsRemaining(Math.max(0, finalConfig.maxAttempts - state.attempts));
    
    if (state.isBlocked && state.blockUntil) {
      setBlockTimeRemaining(Math.max(0, state.blockUntil - now));
    }
  }, [key, finalConfig]);

  const checkLimit = useCallback((): boolean => {
    const now = Date.now();
    let state = stateRef.current.get(key);

    // Se não existe estado, criar novo
    if (!state) {
      state = {
        attempts: 0,
        firstAttempt: now,
        isBlocked: false
      };
      stateRef.current.set(key, state);
    }

    // Se está bloqueado, verificar se ainda é válido
    if (state.isBlocked && state.blockUntil) {
      if (now > state.blockUntil) {
        // Bloqueio expirou
        stateRef.current.delete(key);
        updateState();
        return true;
      } else {
        // Ainda bloqueado
        updateState();
        return false;
      }
    }

    // Verificar se a janela de tempo expirou
    if (now - state.firstAttempt > finalConfig.windowMs) {
      // Reset do contador
      state.attempts = 0;
      state.firstAttempt = now;
    }

    // Verificar se excedeu o limite
    if (state.attempts >= finalConfig.maxAttempts) {
      state.isBlocked = true;
      state.blockUntil = now + finalConfig.blockDurationMs;
      
      SecureLogger.warn(`Rate limit exceeded for key: ${key}`, {
        attempts: state.attempts,
        maxAttempts: finalConfig.maxAttempts,
        blockDuration: finalConfig.blockDurationMs
      });
      
      updateState();
      return false;
    }

    updateState();
    return true;
  }, [key, finalConfig, updateState]);

  const recordAttempt = useCallback((): boolean => {
    if (!checkLimit()) {
      return false;
    }

    const now = Date.now();
    let state = stateRef.current.get(key);

    if (!state) {
      state = {
        attempts: 1,
        firstAttempt: now,
        isBlocked: false
      };
    } else {
      state.attempts += 1;
    }

    stateRef.current.set(key, state);
    
    SecureLogger.debug(`Rate limit attempt recorded for key: ${key}`, {
      attempts: state.attempts,
      maxAttempts: finalConfig.maxAttempts
    });

    updateState();
    return true;
  }, [key, finalConfig, checkLimit, updateState]);

  const reset = useCallback(() => {
    stateRef.current.delete(key);
    setIsBlocked(false);
    setAttemptsRemaining(finalConfig.maxAttempts);
    setBlockTimeRemaining(0);
    SecureLogger.info(`Rate limit reset for key: ${key}`);
  }, [key, finalConfig.maxAttempts]);

  const getTimeUntilReset = useCallback((): number => {
    const state = stateRef.current.get(key);
    if (!state) return 0;

    if (state.isBlocked && state.blockUntil) {
      return Math.max(0, state.blockUntil - Date.now());
    }

    const windowEnd = state.firstAttempt + finalConfig.windowMs;
    return Math.max(0, windowEnd - Date.now());
  }, [key, finalConfig.windowMs]);

  // Atualizar estado inicial
  React.useEffect(() => {
    updateState();
    
    // Atualizar periodicamente se estiver bloqueado
    const interval = setInterval(() => {
      if (isBlocked || blockTimeRemaining > 0) {
        updateState();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [updateState, isBlocked, blockTimeRemaining]);

  return {
    isBlocked,
    attemptsRemaining,
    blockTimeRemaining,
    checkLimit,
    recordAttempt,
    reset,
    getTimeUntilReset
  };
}
