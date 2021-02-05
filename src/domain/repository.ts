import { Card } from './card';

interface Repository{
    save(card: Card): Promise<boolean>
    getAvailableDecks(): Promise<string[]>
}

export default Repository;