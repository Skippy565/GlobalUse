<?php

include_once(dirname(__FILE__).'/genericObjectClass.php');

class ObjectTranslation extends genericObject
{

	public $FromObject;
	public $ToObject;
	public $Translation;
	public $TranslationProblemArray = array();
	public $PostMapping = array();

	public function __construct($keyValueArray=array())
	{
		return $this->instantiate($keyValueArray);
	}

	public function Translate()
	{
		if (!$this->FromObject )//|| !is_object($this->FromObject))
		{
			$retArray = buildResponse('false', 'No object to translate from', '');
			return $retArray;
		}

		if (!$this->ToObject)
		{
			$retArray = buildResponse('false', 'To object not instantiated', '');
			return $retArray;
		}

		if (count($this->Translation) == 0)
		{
			$retArray = buildResponse('false', 'No translation present', '');
			return $retArray;
		}

		$DB = new DB();

		foreach ($this->Translation as $Key=>$Value)
		{
			if (is_object($this->ToObject) && is_array($this->FromObject))
			{
				/*if (! ($this->ToObject->$Value = eval('return $this->FromObject'.$Key.';'))) // works for To object as base object, from object as array
				{
					$this->TranslationProblemArray[count($this->TranslationProblemArray)] = 'Problem Translating '.$Key.' to '.$Value;
				}*/
				echo "Trying to eval this->ToObject->".$Value." = this->FromObject".$Key." with value ".eval('echo $this->FromObject'.$Key.';')."<BR><BR>";
				try
				{
					eval ('$this->ToObject'.$Value.'=(is_array($this->FromObject'.$Key.') ? "" : $this->FromObject'.$Key.');');
				}
				catch (exception $e)
				{
					$this->TranslationProblemArray[count($this->TranslationProblemArray)] = 'Problem Translating '.$Key.' to '.$Value;
				}
			}
			else
			if (is_array($this->ToObject) && is_array($this->FromObject)) // not working currently
			{
				try
				{
					eval ('$this->ToObject'.$Value.'=$this->FromObject'.$Key.';');
				}
				catch (exception $e)
				{
					$this->TranslationProblemArray[count($this->TranslationProblemArray)] = 'Problem Translating '.$Key.' to '.$Value;
				}
			}
			else
			if (is_object($this->ToObject) && is_object($this->FromObject))
			{
				try
				{
					eval ('$this->ToObject->'.$Value.'=$this->FromObject->'.$Key.';');
				}
				catch (exception $e)
				{
					$this->TranslationProblemArray[count($this->TranslationProblemArray)] = 'Problem Translating '.$Key.' to '.$Value;
				}
			}
			else
			{
				$retArray = buildResponse('false', 'Unsupported translation types', '');
				return $retArray;
			}
		}

		$DB->Close();

		if (count($this->TranslationProblemArray) == 0)
		{
			$retArray = buildResponse('true', 'Object translated', $this->ToObject);
		}
		else
		{
			$retArray = buildResponse('false', 'Problem with translation', $this->TranslationProblemArray);
		}
		return $retArray;
	}

	public function PostProcessMapping()
	{
		if (count($this->PostMapping) == 0)
		{
			$retArray = buildResponse('false', 'No post processing mapping', '');
			return $retArray;
		}

		$this->TranslationProblemArray = array();

		foreach ($this->PostMapping as $key=>$value)
		{
			try
			{
				eval ('$this->ToObject'.$key.'='.$value.'($this->ToObject'.$key.');');
			}
			catch (exception $e)
			{
				$this->TranslationProblemArray[count($this->TranslationProblemArray)] = 'this->ToObject'.$key.'='.$value.'(this->ToObject'.$key.');';
			}
		}

		if (count($this->TranslationProblemArray) > 0)
		{
			$retArray = buildResponse('false', 'Problem mapping', $this->TranslationProblemArray);
		}
		else
		{
			$retArray = buildResponse('true', 'Mapped', $this->ToObject);
		}

		return $retArray;
	}
}
