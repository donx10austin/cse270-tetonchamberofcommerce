import pytest
import json

from build_sentences import (
    get_seven_letter_word,
    parse_json_from_file,
    choose_sentence_structure,
    get_pronoun,
    get_article,
    get_word,
    fix_agreement,
    build_sentence,
    structures,
    pronouns,
    articles
)


def test_get_seven_letter_word(mocker):
    mocker.patch("builtins.input", return_value="testing")
    assert get_seven_letter_word() == "TESTING"

    mocker.patch("builtins.input", return_value="apple")
    with pytest.raises(ValueError):
        get_seven_letter_word()


def test_parse_json_from_file(tmp_path):
    test_data = {
        "nouns": ["dog"],
        "verbs": ["runs"]
    }

    file_path = tmp_path / "test.json"

    with open(file_path, "w") as f:
        json.dump(test_data, f)

    result = parse_json_from_file(file_path)

    assert result == test_data


def test_choose_sentence_structure(mocker):
    mock_choice = mocker.patch("random.choice", return_value=structures[2])

    result = choose_sentence_structure()

    assert result == structures[2]
    mock_choice.assert_called_once_with(structures)


def test_get_pronoun(mocker):
    mock_choice = mocker.patch("random.choice", return_value="he")

    result = get_pronoun()

    assert result == "he"
    mock_choice.assert_called_once_with(pronouns)


def test_get_article(mocker):
    mock_choice = mocker.patch("random.choice", return_value="the")

    result = get_article()

    assert result == "the"
    mock_choice.assert_called_once_with(articles)


def test_get_word():
    words = ["Apple", "Banana", "Cat"]

    assert get_word("A", words) == "Apple"
    assert get_word("B", words) == "Banana"
    assert get_word("C", words) == "Cat"


def test_fix_agreement():
    # Rule 1
    sentence = ["he", "quickly", "run"]
    fix_agreement(sentence)
    assert sentence[2] == "runs"

    # Rule 2
    sentence = ["a", "big", "apple"]
    fix_agreement(sentence)
    assert sentence[0] == "an"

    # Rule 3
    sentence = ["the", "big", "dog", "quickly", "run"]
    fix_agreement(sentence)
    assert sentence[4] == "runs"


def test_build_sentence(mocker):

    mocker.patch("build_sentences.get_article", return_value="a")
    mocker.patch("build_sentences.get_pronoun", return_value="they")

    data = {
        "adjectives": ["angry"] * 26,
        "nouns": ["dog"] * 26,
        "verbs": ["run"] * 26,
        "adverbs": ["quickly"] * 26,
        "prepositions": ["over"] * 26
    }

    for structure in structures:
        sentence = build_sentence(
            "ABCDEFGHIJK",
            structure,
            data
        )

        assert isinstance(sentence, str)
        assert len(sentence) > 0