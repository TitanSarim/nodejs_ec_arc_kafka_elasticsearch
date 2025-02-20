import { CartRepositoryType } from "../types/repo.type";
import * as Repository from "../respository/cart.repo";
import { CreateCart } from "../service/cart.service";
describe("cartService", () => {
  let repo: CartRepositoryType;
  beforeEach(() => {
    repo = Repository.CartRepository;
  });

  afterEach(() => {
    repo = {} as CartRepositoryType;
  });

  it("should return correct data while creating cart", async () => {
    const mockCart = {
      title: "smart phone",
      amount: 1200,
    };

    jest.spyOn(Repository.CartRepository, "create").mockImplementationOnce(() =>
      Promise.resolve({
        message: "Fake response from cart repository",
        input: mockCart,
      })
    );

    const res = await CreateCart(mockCart, repo);

    expect(res).toEqual({
      message: "Fake response from cart repository",
      input: mockCart,
    });
  });
});
