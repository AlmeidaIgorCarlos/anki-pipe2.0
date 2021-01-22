import { Card } from './card';

interface Repository{
    save(card: Card): Promise<boolean>
}

export default Repository;