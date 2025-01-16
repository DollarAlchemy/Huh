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
        System.out.println("----------------------------------------------------------");

        while (true) {
            playGame();

            System.out.print("Would you like to play again? (yes/no): ");
            String playAgain = scanner.nextLine().trim().toLowerCase();
            if (!playAgain.equals("yes")) {
                System.out.println("Thanks for playing! Goodbye!");
                break;
            }
            System.out.println("----------------------------------------------------------");
        }
    }

    private static void playGame() {
        // Tier 1 Selection
        String tier1Choice = getValidTier1Choice();
        System.out.println("You chose " + tier1Choice + ".");

        // Tier 2 Selection
        List<String> tier2OptionsForChoice = tier2Options.get(tier1Choice);
        System.out.println("Choose a Tier 2 pathway:");
        String tier2Choice = getValidTier2Choice(tier2OptionsForChoice);

        // Determine final result
        String playerResult = tier3Results.get(tier2Choice);
        String aiResult = aiChoices.get(new Random().nextInt(aiChoices.size()));

        System.out.println("\nYour final element is: " + playerResult);
        System.out.println("AI's final element is: " + aiResult);

        // Determine outcome
        String outcome = determineOutcome(playerResult, aiResult);
        System.out.println("Game outcome: " + outcome);

        System.out.println("----------------------------------------------------------");
    }

    private static String getValidTier1Choice() {
        while (true) {
            System.out.println("Tier 1: Choose your Primary Element (Earth, Water, Fire):");
            String choice = scanner.nextLine().trim();
            if (tier2Options.containsKey(choice)) {
                return choice;
            }
            System.out.println("Invalid choice. Please try again.");
        }
    }

    private static String getValidTier2Choice(List<String> options) {
        while (true) {
            for (int i = 0; i < options.size(); i++) {
                System.out.println((i + 1) + ". " + options.get(i));
            }
            int choiceIndex = getUserChoice(options.size());
            if (choiceIndex != -1) {
                return options.get(choiceIndex - 1);
            }
            System.out.println("Invalid choice. Please try again.");
        }
    }

    private static int getUserChoice(int maxOptions) {
        try {
            System.out.print("Enter your choice (1-" + maxOptions + "): ");
            int choice = Integer.parseInt(scanner.nextLine().trim());
            if (choice >= 1 && choice <= maxOptions) {
                return choice;
            }
        } catch (NumberFormatException e) {
            // Fall through to invalid choice message
        }
        return -1;
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
