<?php
/**
 * kort - Model\Badge class
 */

namespace Model;

/**
 * The Badge class represents an achievment, that user can win.
 *
 * It is part of the reward that user gets for playing kort.
 */
class Badge
{
    /**
     * The name of the badge.
     *
     * @var string
     */
    protected $name;

     /**
      * The array of all names and ids of all badges.
      *
      * @var array
      */
    protected static $names = array(
            1 => 'highscore_place_1',
            2 => 'highscore_place_2',
            3 => 'highscore_place_3',
            4 => 'fix_count_100',
            5 => 'fix_count_50',
            6 => 'fix_count_10',
            7 => 'vote_count_1000',
            8 => 'vote_count_100',
            9 => 'vote_count_10'
    );

    /**
     * Returns a new Badge object for the given $id.
     *
     * @param integer $id The id of a badge.
     *
     * @return Badge|null a new Badge object identified by $id
     * or null if not found
     */
    public static function findById($id)
    {
        if (array_key_exists($id, self::$names)) {
            return new Badge(self::$names[$id]);
        }
        return null;
    }

    /**
    * Returns an array of values of the given badges.
     *
    * @param array $badges Values should be returned.
     *
    * @return an array of values of the given badges
    */
    public static function getValues(array $badges)
    {
        return array_map("self::getValue", $badges);
    }

    /**
    * Returns an array of properties representing the 'value' of a badge.
     *
    * @param Badge $badge Value should be returned.
     *
    * @return an array of values of the given badges
    */
    private static function getValue(Badge $badge)
    {
        return array("name" => $badge->getName());
    }

    /**
    * Creates a new instance of Badge.
     *
    * @param string $name The name of the badge.
    */
    public function __construct($name)
    {
        $this->name = $name;
    }

    /**
    * Returns the badge's name.
     *
    * @return string containing the badge's name
    */
    public function getName()
    {
        return $this->name;
    }
}
