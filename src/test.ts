import { Visibility } from "./Storage";
import { LocalStorage } from "./local/Storage";

const storage = new LocalStorage(Visibility.PRIVATE, "test");

storage.Hash("user").fromObject({
  username: "test",
  password: "test",
});

while (true) {
  storage.set("test", Math.random().toString()).then((result) => {});
}
