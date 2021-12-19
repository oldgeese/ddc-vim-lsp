import {
  BaseSource,
  Candidate,
} from "https://deno.land/x/ddc_vim@v1.0.0/types.ts#^";

import {
  GatherCandidatesArguments,
} from "https://deno.land/x/ddc_vim@v1.0.0/base/source.ts#^";

// deno-lint-ignore ban-types
type Params = {};

export class Source extends BaseSource<Params> {
  private counter = 0;
  async gatherCandidates(
    args: GatherCandidatesArguments<Params>,
  ): Promise<Candidate[]> {
    this.counter = (this.counter + 1) % 100;

    const lspservers: string[] = await args.denops.call(
      "lsp#get_allowed_servers",
      // deno-lint-ignore no-explicit-any
    ) as any;
    if (lspservers.length === 0) {
      return [];
    }

    const id = `source/${this.name}/${this.counter}`;

    const [items] = await Promise.all([
      args.onCallback(id) as Promise<Candidate[]>,
      ...lspservers.map(lspserver => args.denops.call("ddc_vim_lsp#request", lspserver, id))
    ]);
    return items;
  }

  params(): Params {
    return {};
  }
}
