<?php

function buildResponse($Status, $Message, $Data)
{
	$retArray = [];
	$tempArray = [];
	$tempArray['Status'] = $Status;
	$tempArray['Message'] = $Message;
	
	$retArray['Result'] = $tempArray;
	$retArray['Data'] = $Data;
	
	return $retArray;
}

abstract class Util_Service_ObjectTranslation
{
	public static function Translate($FromObject, $ToObject, Array $Translation, Array $IncludeFiles = [], Array $PostMapping = [], Array $OverwriteRules = [])
	{
		if (!$FromObject)
		{
			$retArray = buildResponse('false', 'No object to translate from', '');
			return $retArray;
		}

		if (!$ToObject)
		{
			$retArray = buildResponse('false', 'To object not instantiated', '');
			return $retArray;
		}

		if (function_exists('preMap'))
		{
			$ToObject = preMap($FromObject, $ToObject);
		}

		$TranslationProblemArray = [];

		foreach ($Translation as $Key=>$Value)
		{
			//check against values
			if (!self::checkOverwrite($ToObject, $Key, $OverwriteRules))
			{
				continue;
			}

			if (is_array($ToObject) && is_array($FromObject))
			{
				try
				{
					$ToObject[$Value]=$FromObject[$Key];
				}
				catch (Exception $e)
				{
					$TranslationProblemArray[count($TranslationProblemArray)] = 'Problem Translating '.$Key.' to '.$Value . ' of ' . $e->getMessage();
				}
			}
			else
			if (is_object($ToObject) && is_array($FromObject))
			{
				try 
				{
					$ToObject->__set($Value, $FromObject[$Key]);
				}
				catch (Exception $e)
				{
					$TranslationProblemArray[count($TranslationProblemArray)] = 'Problem Translating ' . $Key . ' to ' . $Value . ' of ' . $e->getMessage();
				}
			}
			else
			if (is_array($ToObject) && is_object($FromObject))
			{
				try 
				{
					$ToObject[$Value] = $FromObject->__get($Key);
				}
				catch (Exception $e)
				{
					$TranslationProblemArray[count($TranslationProblemArray)] = 'Problem Translating ' . $Key . ' to ' . $Value . ' of ' . $e->getMessage();
				}
			}
			else
			{
				$retArray = buildResponse('false', 'Unsupported translation types', '');
				return $retArray;
			}
		}

		if (count($TranslationProblemArray) == 0)
		{
			$retArray = self::PostProcessMapping($FromObject, $ToObject, $IncludeFiles, $PostMapping);
		}
		else
		{
			$retArray = buildResponse('false', 'Problem with translation', $TranslationProblemArray);
		}
		return $retArray;
	}

	public static function PostProcessMapping($FromObject, $ToObject, Array $IncludeFiles = [], Array $PostMapping = [], Array $OverwriteRules = [])
	{
		if (count($PostMapping) == 0)
		{
			$retArray = buildResponse('true', 'No post processing mapping', $ToObject);
			return $retArray;
		}

		for ($i=0;$i<count($IncludeFiles);$i++)
		{
			include_once($IncludeFiles[$i]);
		}

		$TranslationProblemArray = array();

		foreach ($PostMapping as $key=>$value)
		{
			if (is_array($ToObject) && is_array($FromObject))
			{
				try
				{
					$ToObject[$key]=$value($FromObject);
				}
				catch (Exception $e)
				{
					$TranslationProblemArray[count($TranslationProblemArray)] = 'ToObject'.$key.'='.$value.'(ToObject'.$key.') of ' . $e->getMessage();
				}
			}
			else
			if (is_object($ToObject) && is_array($FromObject))
			{
				try
				{
					$ToObject->__set($key, $value($FromObject));
				}
				catch (Exception $e)
				{
					$TranslationProblemArray[count($TranslationProblemArray)] = 'ToObject->__set('.$key.', '.$value.'(FromObject)) of ' . $e->getMessage();
				}
			}
			else
			if (is_array($ToObject) && is_object($FromObject))
			{
				try
				{
					$ToObject[$key] = $value($FromObject);
				}
				catch (Exception $e)
				{
					$TranslationProblemArray[count($TranslationProblemArray)] = 'ToObject['.$key.'] = '.$value.'(FromObject) of ' . $e->getMessage();
				}
			}
		}

		if (count($TranslationProblemArray) > 0)
		{
			$retArray = buildResponse('false', 'Problem mapping', $TranslationProblemArray);
		}
		else
		{
			if (function_exists('postMap'))
			{
				$ToObject = postMap($FromObject, $ToObject);
			}
			$retArray = buildResponse('true', 'Mapped', $ToObject);
		}

		return $retArray;
	}

	//checks overwrite flag + also checks against overwrite values
	public static function checkOverwrite($ToObject, $key, Array $OverwriteRules = [])
	{
		//case where always overwrite the value
		if (isset($OverwriteRules['Keys']) && isset($OverwriteRules['Keys'][$key]))
			return true;

		if (is_array($ToObject))
		{
			if (isset($OverwriteRules['Values']) && !in_array($ToObject[$key], $OverwriteRules['Values']))
				return false;
			else
				return true;
		}
		else
		if (is_object($ToObject))
		{
			if (isset($OverwriteRules['Value']) && !in_array($ToObject->__get($key), $OverwriteRules['Values']))
				return false;
			else
				return true;
		}
		else //unsupported type
		{
			return true;
		}
	}
}