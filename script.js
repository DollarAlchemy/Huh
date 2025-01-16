import java.util.*;

public class ElementalPathwayGame {

    // Tier 2 options
    private static final Map<String, List<String>> tier2Options = Map.of(
        "Earth", Arrays.asList("Metal", "Wood"),
        "Water", Arrays.asList("Steam", "Ice"),
        "Fire", Arrays.asList("Lava", "Steam")
    );

    // Tier 3 results
    private static final Map<String, String> tier3Results = Map.of(
        "Metal", "Wind",
        "Wood", "Lava",
        "Steam", "Ice",
        "Lava", "Ice",
        "Ice", "Wind",
        "Wind", "Lava"
    );

    // AI choices for Tier 3
    private static final List<String> aiChoices = Arrays.asList("Wind", "Lava", "Ice");

    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("Welcome to the Elemental Pathway Game!");
        System.out.println("Navigate through the tiers and see if you can outsmart the AI!");
        System.out.println();

        while (true) {
            playGame();

            System.out.print("Would you like to play again? (yes/no): ");
            String playAgain = scanner.nextLine().trim().toLowerCase();
            if (!playAgain.equals("yes")) {
                System.out.println("Thanks for playing! Goodbye!");
                break;
            }
        }
    }

    private static void playGame() {
        System.out.println("Tier 1: Choose your Primary Element (Earth, Water, Fire):");
        String tier1Choice = scanner.nextLine().trim();

        if (!tier2Options.containsKey(tier1Choice)) {
            System.out.println("Invalid choice. Please try again.");
            return;
        }

        System.out.println("You chose " + tier1Choice + ". Choose a Tier 2 pathway:");
        List<String> options = tier2Options.get(tier1Choice);
        for (int i = 0; i < options.size(); i++) {
            System.out.println((i + 1) + ". " + options.get(i));
        }

        int tier2ChoiceIndex = getUserChoice(options.size());
        if (tier2ChoiceIndex == -1) {
            System.out.println("Invalid choice. Please try again.");
            return;
        }

        String tier2Choice = options.get(tier2ChoiceIndex - 1);
        String playerResult = tier3Results.get(tier2Choice);

        // AI's choice
        String aiResult = aiChoices.get(new Random().nextInt(aiChoices.size()));

        System.out.println("Your final element is: " + playerResult);
        System.out.println("AI's final element is: " + aiResult);

        // Determine outcome
        String outcome = determineOutcome(playerResult, aiResult);
        System.out.println("Game outcome: " + outcome);
    }

    private static int getUserChoice(int maxOptions) {
        try {
            System.out.print("Enter your choice (1-" + maxOptions + "): ");
            int choice = Integer.parseInt(scanner.nextLine().trim());
            if (choice < 1 || choice > maxOptions) {
                return -1;
            }
            return choice;
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private static String determineOutcome(String player, String ai) {
        if (player.equals(ai)) {
            return "It's a draw!";
        }
        if ((player.equals("Wind") && ai.equals("Lava")) ||
            (player.equals("Lava") && ai.equals("Ice")) ||
            (player.equals("Ice") && ai.equals("Wind"))) {
            return "You win!";
        }
        return "AI wins!";
    }
}
