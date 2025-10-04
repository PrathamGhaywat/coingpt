export type CoinGPTData = {
    coins: number;
    cooldownUntil: number;
    chatHistory: { role: 'user' | 'assistant'; content: string }[];
}

export const getStorage = (): CoinGPTData => {
    if (typeof window === 'undefined') return { coins: 0, cooldownUntil: 0, chatHistory: [] };
    try {
    const data = JSON.parse(localStorage.getItem('coingpt') || '{}');
    return {
        coins: data.coins || 0,
        cooldownUntil: data.cooldownUntil || 0,
        chatHistory: data.chatHistory || [],
    };
    } catch {
        return { coins: 0, cooldownUntil: 0, chatHistory:  [] };
    }
}

export const saveStorage = (data: Partial<CoinGPTData>) => {
  const current = getStorage();
  const updated = { ...current, ...data };
  localStorage.setItem('coingpt', JSON.stringify(updated));
};