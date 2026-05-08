export type Message = {
    id: number | null;
    message: string;
    author: string | 'uknown';
    timeStamp: string;
}