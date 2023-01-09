import grpc from "k6/net/grpc";
import { check, sleep } from "k6";

const client = new grpc.Client();
client.load([".."], "hello.proto");

export const options = {
    stages: [
        { duration: "10s", target: 1 },
    ],
};

export default () => {
    client.connect("127.0.0.1:5001", {
        plaintext: true
    });

    const data = { greeter: "lmao" };
    const response = client.invoke("hello.Greeter/SayHello", data);

    check(response, {
        "status is OK": (r) => r && r.status === grpc.StatusOK,
    });
    console.log(response);

    client.close();
    sleep(1);
};
