export class Transcript {

  constructor(public tokens: string[], public times: number[], public surprisals: number[]) { }

  async load(): Promise<void> { }

}
