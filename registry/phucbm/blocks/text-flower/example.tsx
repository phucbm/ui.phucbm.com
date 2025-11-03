import {TextFlower} from "@/registry/phucbm/blocks/text-flower/text-flower";

export default function Example() {
    const texts = [
        "🐧 Watch the penguins waddle by.",
        "🐘 See the elephants remember everything.",
        "🐺 Hear the wolves howl at night.",
        "🐙 Find the octopus hiding below.",
        "🐆 Chase the cheetah running fast.",
        "🦥 Meet the sloth moving slow.",
        "🦚 Dance with the peacock's colors.",
        "🐬 Swim with the dolphins playing.",
        "🦋 Follow the butterflies floating.",
        "🦉 Listen to the owl's wisdom.",
        "🐝 Marvel at the hummingbird's speed.",
        "🐻 Observe the bear catching fish.",
        "🦎 Discover the chameleon's disguise.",
    ];
    return (
        <TextFlower texts={texts}/>
    );
}